import { lazy } from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import NotFoundPage from '@/components/errors/NotFoundPage';
import HomeHeader from '@/components/layout/main-layout/header/HomeHeader';
import SaleHeader from '@/components/layout/main-layout/header/SaleHeader';
import MainLayout from '@/components/layout/main-layout/MainLayout';
import {paths} from '@/config/paths';
const Dashboard = lazy(() => import('@/app/pages/Dashboard'))
const Products = lazy(() => import('@/app/pages/Products'))
export const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path: paths.home,
            element: <MainLayout header={HomeHeader}/>,
            children: [
                {
                    path: paths.home,
                    element: <Dashboard/>
                },
                {
                    path: paths.products,
                    element: <Products/>
                }
            
            ]
        }, 
        {
            path: paths.sell,
            element: <MainLayout header={SaleHeader}/>,
            children: [
                {
                    path: '',
                    element: <Dashboard/>
                }
            ]
        },
        {
            path: '*',
            element: <NotFoundPage/>,
        }
    ])
    return <RouterProvider router={router}/>
}