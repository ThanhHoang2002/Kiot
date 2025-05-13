import { generateQRUrl, checkPaymentStatus } from "../api/qrPaymentApi"
import { processPayment } from "../api/transactionApi"
import { speakText } from "../api/zaloTtsApi"
import { PAYMENT_TIME, PAYMENT_CHECK_INTERVAL, TRANSACTION_PREFIX } from "../constant/payment"
import { useQRPaymentStore } from "../store/qrStore"
import { OrdersPayload } from "../types"

// Create a store for QR payment state

export const processingPayment = async (transaction: OrdersPayload) : Promise<boolean>=>{
    switch (transaction.paymentMethod ){
        case 'CASH':
           return await CashPayment(transaction)
            
        case 'TRANSFER':
           return await TransferPayment(transaction)
            
        default:
            return false
            
    }
}

// Format số tiền thành chuỗi đọc dễ hiểu
const formatMoneyForSpeech = (amount: number): string => {
    // Nếu ít hơn 1 triệu, đọc số ngàn
    if (amount < 1000000) {
        return `${Math.floor(amount / 1000)} nghìn`;
    }
    
    // Nếu từ 1 triệu đến 999 triệu
    if (amount < 1000000000) {
        const millions = Math.floor(amount / 1000000);
        const thousands = Math.floor((amount % 1000000) / 1000);
        
        if (thousands > 0) {
            return `${millions} triệu ${thousands} nghìn`;
        }
        return `${millions} triệu`;
    }
    
    // Nếu từ 1 tỷ trở lên
    const billions = Math.floor(amount / 1000000000);
    const millions = Math.floor((amount % 1000000000) / 1000000);
    
    if (millions > 0) {
        return `${billions} tỷ ${millions} triệu`;
    }
    return `${billions} tỷ`;
}

// Phát thông báo thanh toán thành công
export const announceSucessfulPayment = async (amount: number) => {
    try {
        const formattedAmount = formatMoneyForSpeech(amount);
        const message = `Thanh toán thành công ${formattedAmount} đồng`;
        
        // Phát thông báo bằng giọng nói
        await speakText(message);
    } catch (error) {
        console.error("Failed to announce payment:", error);
        // Không throw lỗi để không làm gián đoạn quy trình thanh toán
    }
}

const CashPayment = async(transaction: OrdersPayload): Promise<boolean>=>{
    await processPayment(transaction)
    return true
}

const TransferPayment = async(transaction: OrdersPayload): Promise<boolean> => {
    // Calculate total amount to pay
    const totalAmount = transaction.items.reduce((sum, item) => 
        sum + (item.sellPrice * item.quantity), 0);
    
    // Generate a unique reference code for this transaction
    const referenceCode = `${TRANSACTION_PREFIX}-${Date.now()}-${transaction.customerId ?transaction.customerId: '1'}`;
    
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
        const resolveOnce = async (success: boolean) => {
            if (!paymentResolved) {
                paymentResolved = true;
                
                // Ensure cleanup happens before resolving
                cleanup();
                
                // Nếu thanh toán thành công, phát thông báo
           
                
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