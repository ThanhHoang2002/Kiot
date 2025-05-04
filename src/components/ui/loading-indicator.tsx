import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingIndicator = ({ className = '', size = 'md' }: LoadingIndicatorProps) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className={`animate-spin text-primary ${sizeMap[size]} ${className}`} />
    </div>
  );
}; 