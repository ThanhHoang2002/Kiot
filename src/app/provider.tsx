import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';

import GlobalLoading from '@/components/loading/GlobalLoading';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/query-client';


export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<GlobalLoading/>}
    >    
          <QueryClientProvider client={queryClient}>
            {import.meta.env.DEV && <ReactQueryDevtools />}        
              {children}
              <Toaster  />
          </QueryClientProvider>
    </Suspense>
  );
};
