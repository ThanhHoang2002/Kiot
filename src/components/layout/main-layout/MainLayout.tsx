import { ComponentType } from 'react';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  header: ComponentType;
}
const MainLayout = ({header:Header} :MainLayoutProps) => {
  return (
      <div className=" flex min-h-screen w-full flex-col bg-gray-50" >
        <div className='sticky top-0 z-10 h-11 w-full bg-primary'> 
          <Header/>
        </div>
        <main className='p-1'>
          <Outlet />
        </main>
      </div>
  );
}; 

export default MainLayout; 