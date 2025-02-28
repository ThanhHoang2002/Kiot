import React from 'react';
import { Link } from 'react-router-dom';

import { useCartStore } from '@/stores/cartStore';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Your cart is empty</h2>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex justify-between">
        <h2 className="mb-6 text-2xl font-bold">Shopping Cart</h2>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800"
        >
          Clear Cart
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-lg bg-white p-4 shadow"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-24 w-24 object-contain"
            />
            <div className="flex-1">
              <Link
                to={`/product/${item.id}`}
                className="text-lg font-semibold hover:text-blue-600"
              >
                {item.title}
              </Link>
              <div className="mt-1 text-gray-600">${item.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                className="rounded border p-1"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <div className="mb-4 text-xl font-bold">
          Total: ${total.toFixed(2)}
        </div>
        <button
          className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
          onClick={() => alert('Checkout functionality coming soon!')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart; 