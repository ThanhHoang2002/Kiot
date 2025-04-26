import { generateQRUrl, checkPaymentStatus } from "../api/qrPaymentApi"
import { processPayment } from "../api/transactionApi"
import { PAYMENT_TIME, PAYMENT_CHECK_INTERVAL, TRANSACTION_PREFIX } from "../constant/payment"
import { useQRPaymentStore } from "../store/qrStore"
import { OrdersPayload } from "../types"

// Create a store for QR payment state

export const processingPayment = async (transaction: OrdersPayload) : Promise<boolean>=>{
    switch (transaction.paymentMethod ){
        case 'CASH':
           return await CashPayment(transaction)
            break
        case 'TRANSFER':
           return await TransferPayment(transaction)
            break
        default:
            return false
            break
    }
}
const CashPayment =async(transaction: OrdersPayload): Promise<boolean>=>{
    await processPayment(transaction)
    return true
}

const TransferPayment = async(transaction: OrdersPayload): Promise<boolean> => {
    // Calculate total amount to pay
    const totalAmount = transaction.items.reduce((sum, item) => 
        sum + (item.sellPrice * item.quantity), 0);
    
    // Generate a unique reference code for this transaction
    const referenceCode = `${TRANSACTION_PREFIX}-${Date.now()}-${transaction.customerId}`;
    
    // Generate QR code URL for payment
    const qrCodeUrl = generateQRUrl(totalAmount, referenceCode);
    
    // Get the QR payment store
    const qrPaymentStore = useQRPaymentStore.getState();
    
    // Set QR data and open the dialog
    qrPaymentStore.setQRData(qrCodeUrl, totalAmount, referenceCode);
    qrPaymentStore.setIsOpen(true);
    
    // Create a promise that will be resolved when payment is completed or rejected
    return new Promise((resolve) => {
        let paymentCompleted = false;
        let paymentResolved = false;
        let timeoutId: number | null = null;
        let checkInterval: number | null = null;
        let unsubscribe: (() => void) | null = null;
        
        // Function to clean up intervals and reset state
        const cleanup = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }
            
            // Unsubscribe from store changes
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
            
            // Reset QR payment state - do this last and only once
            if (useQRPaymentStore.getState().isOpen) {
                qrPaymentStore.setIsOpen(false);
                qrPaymentStore.resetData();
            }
        };
        
        // Function to resolve the promise only once
        const resolveOnce = (success: boolean) => {
            if (!paymentResolved) {
                paymentResolved = true;
                
                // Ensure cleanup happens before resolving
                cleanup();
                
                // Resolve after a short delay to allow state to settle
                setTimeout(() => {
                    resolve(success);
                }, 0);
            }
        };
        
        // Set timeout for 90 seconds
        timeoutId = window.setTimeout(() => {
            if (!paymentCompleted) {
                resolveOnce(false);
            }
        }, PAYMENT_TIME * 1000); // Convert to milliseconds
        
        // Check payment status at regular intervals (defined by PAYMENT_CHECK_INTERVAL)
        checkInterval = window.setInterval(async () => {
            try {
                // Skip if payment already completed or resolved
                if (paymentCompleted || paymentResolved) {
                    return;
                }
                
                // Check if dialog is still open
                if (!useQRPaymentStore.getState().isOpen) {
                    resolveOnce(false);
                    return;
                }
                
                // Check payment status
                const paymentSuccess = await checkPaymentStatus(totalAmount, referenceCode);
                
                if (paymentSuccess) {
                    paymentCompleted = true;
                    
                    // Process the successful payment
                    await processPayment(transaction);
                    
                    // Resolve with success
                    resolveOnce(true);
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        }, PAYMENT_CHECK_INTERVAL); // Check interval from constants
        
        // Listen for dialog close events - set up once and store unsubscribe function
        unsubscribe = useQRPaymentStore.subscribe((state) => {
            // Only respond to the isOpen state changing to false
            if (!state.isOpen && !paymentCompleted && !paymentResolved) {
                resolveOnce(false);
            }
        });
    });
}