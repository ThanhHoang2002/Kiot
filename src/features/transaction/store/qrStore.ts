import { create } from "zustand"

interface QRPaymentState {
  isOpen: boolean
  qrImageUrl: string
  amount: number
  referenceCode: string
  
  setIsOpen: (isOpen: boolean) => void
  setQRData: (qrImageUrl: string, amount: number, referenceCode: string) => void
  resetData: () => void
}

export const useQRPaymentStore = create<QRPaymentState>((set) => ({
  isOpen: false,
  qrImageUrl: '',
  amount: 0,
  referenceCode: '',
  
  setIsOpen: (isOpen) => set({ isOpen }),
  
  setQRData: (qrImageUrl, amount, referenceCode) => 
    set({ qrImageUrl, amount, referenceCode }),
  
  resetData: () => set({ 
    qrImageUrl: '', 
    amount: 0, 
    referenceCode: ''
  })
}))
