import axios from 'axios';

// Environment variables would be used here in a real app
// These are placeholders to be replaced by your actual env variables
const BANK_ID: string = import.meta.env.VITE_BANK_ID || '';
const ACCOUNT_NO: string = import.meta.env.VITE_ACCOUNT_NO || '';
const ACCOUNT_NAME: string = import.meta.env.VITE_ACCOUNT_NAME || '';
const TEMPLATE: string = import.meta.env.VITE_QR_TEMPLATE || 'compact';
const VITE_CASSO_TOKEN: string = import.meta.env.VITE_CASSO_TOKEN || '';

/**
 * Generate a VietQR image URL for bank transfer
 */
export const generateQRUrl = (amount: number, description: string): string => {
  // Encode parameters for URL
  const encodedAccountName = encodeURIComponent(ACCOUNT_NAME);
  const encodedDescription = encodeURIComponent(description);
  
  // Construct the full VietQR URL
  return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${amount}&addInfo=${encodedDescription}&accountName=${encodedAccountName}`;
};

/**
 * Check payment status from Casso API
 * Returns true if payment is confirmed, false otherwise
 */
export const checkPaymentStatus = async (amount: number, description: string) => {
  try {
    // Call to Casso API to check transaction status
    const response = await axios.get('https://oauth.casso.vn/v2/transactions', {
      headers: {
        Authorization: VITE_CASSO_TOKEN
      },
      params: {
        sort: 'DESC',
        pageSize: '1',
        page: '1'
      }
    });
    
    // Verify that response structure is as expected
    if (!response.data || !response.data.data || !response.data.data.records || !response.data.data.records[0]) {
      return false;
    }
    
    const latestTransaction = response.data.data.records[0];
    const currentAmount = latestTransaction.amount;
    const currentDescription = latestTransaction.description;
    if (currentAmount >= amount && currentDescription.includes(description.split('-').join(''))) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
    return false;
  }
}; 