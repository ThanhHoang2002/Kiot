import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import { useCartStore } from '@/stores/cartStore';

export const MainLayout: React.FC = () => {
  const cartItems = useCartStore(state => state.items);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-bold text-gray-800">
              FakeStore
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Products
              </Link>
              <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
                Cart
                {cartItems.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}; 