import { ImageIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/cn';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  containerClassName?: string;
}

export const Image = ({
  src,
  alt = '',
  className,
  containerClassName,
  fallback = <ImageIcon className="h-5 w-5" />,
  ...props
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div 
      className={cn(
        "relative h-5 w-5 overflow-hidden bg-gray-100",
        containerClassName
      )}
    >
      {(isLoading || error) && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          {fallback}
        </div>
      )}
      
      {!error && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
          {...props}
        />
      )}
    </div>
  );
};

export default Image;