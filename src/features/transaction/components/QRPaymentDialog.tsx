import { useEffect, useState } from 'react';

import { PAYMENT_TIME, PAYMENT_CHECK_INTERVAL } from '../constant/payment';
import { useQRPaymentStore } from '../store/qrStore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/utils/cn';


export const QRPaymentDialog = () => {
  const { isOpen, qrImageUrl, amount, setIsOpen } = useQRPaymentStore();
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIME);
  const [timerExpired, setTimerExpired] = useState(false);
  
  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog closes
      setTimeLeft(PAYMENT_TIME);
      setTimerExpired(false);
      return;
    }
    
    // Reset timer when dialog opens
    setTimeLeft(PAYMENT_TIME);
    setTimerExpired(false);
    
    // Start countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerExpired(true);
          // Don't close automatically, let user see the expired message
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Clean up on close or unmount
    return () => clearInterval(timer);
  }, [isOpen, setIsOpen]);
  
  // Format remaining time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {timerExpired ? 'Hết thời gian thanh toán' : 'Quét mã QR để thanh toán'}
          </DialogTitle>
          <DialogDescription>
            {timerExpired 
              ? `Thời gian quét mã QR đã hết (${PAYMENT_TIME} giây). Vui lòng thử lại.`
              : `Sử dụng ứng dụng ngân hàng của bạn để quét mã QR thanh toán. Hệ thống sẽ kiểm tra thanh toán mỗi ${PAYMENT_CHECK_INTERVAL/1000} giây.`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4">
          {timerExpired ? (
            <div className="mb-4 text-center">
              <p className="mb-2 font-medium text-red-500">
                Đã hết thời gian thanh toán ({PAYMENT_TIME} giây)
              </p>
              <p className="text-gray-600">
                Vui lòng đóng và thử lại nếu bạn vẫn muốn thanh toán.
              </p>
            </div>
          ) : (
            qrImageUrl && (
              <div className="relative mb-4 rounded-lg border p-2">
                <img 
                  src={qrImageUrl} 
                  alt="Mã QR thanh toán" 
                  className="h-64 w-64 object-contain"
                />
              </div>
            )
          )}
          
          <div className="mb-2 text-center text-lg font-semibold">
            Số tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
          </div>
          
          {!timerExpired && (
            <div className={cn(
              "text-center text-sm font-medium",
              timeLeft <= 15 ? "text-red-500" : "text-gray-500"
            )}>
              Thời gian còn lại: {formatTime(timeLeft)}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-row justify-center gap-2 sm:justify-center">
          <Button 
            variant="destructive"
            onClick={handleClose}
          >
            {timerExpired ? 'Đóng' : 'Hủy thanh toán'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 