import { lazy } from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router';

import NotFoundPage from '@/components/errors/NotFoundPage';
import {MainLayout} from '@/components/layout/main-layout/MainLayout';
import {paths} from '@/config/paths';
const Products = lazy(() => import('@/app/pages/product/Products'));
const ProductDetail = lazy(() => import('@/app/pages/product/ProductDetail'));
const Cart = lazy(() => import('@/app/pages/cart/Cart'));
export const AppRouter = () => {
    const router = createBrowserRouter([
        {
            element: <MainLayout />,
            children: [
                {
                    path: paths.home,
                    element: <Products />,
                },
                {
                    path: '/products/:id',
                    element: <ProductDetail />,
                },
                {
                    path: '/cart',
                    element: <Cart />,
                },                     
            ],
            errorElement: <NotFoundPage/>,
        },
    
    ])
    return <RouterProvider router={router}/>
}