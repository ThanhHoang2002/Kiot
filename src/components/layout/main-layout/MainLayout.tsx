import { ComponentType, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  header: ComponentType;
}
const MainLayout = ({header:Header} :MainLayoutProps) => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
      <div className=" flex min-h-screen w-full flex-col" >
        <div className='z-10 w-full bg-primary'> 
          <Header/>
        </div>
        <main className='p-1'>
          <Outlet />
        </main>
      </div>
  );
}; 

export default MainLayout; 