import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthGuard from "@/components/auth/AuthGuard";
import NotFoundPage from "@/components/errors/NotFoundPage";
import HomeHeader from "@/components/layout/main-layout/header/HomeHeader";
import MainLayout from "@/components/layout/main-layout/MainLayout";
import { paths } from "@/config/paths";
const Dashboard = lazy(() => import("@/app/pages/Dashboard"));
const Products = lazy(() => import("@/app/pages/Products"));
const LoginPage = lazy(() => import("@/app/pages/Login"));
const TransactionPage = lazy(() => import("@/app/pages/TransactionPage"));
export const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: paths.home,
      element: (
        <AuthGuard>
          <MainLayout header={HomeHeader} />
        </AuthGuard>
      ),
      children: [
        {
          path: paths.home,
          element: <Dashboard />,
        },
        {
          path: paths.products,
          element: <Products />,
        },
        {
          path: paths.transaction,
          element: <TransactionPage />,
        },
      ],
    },
    {
      path: paths.login,
      element: <LoginPage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};
