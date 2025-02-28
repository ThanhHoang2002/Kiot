import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useProduct } from '@/features/products/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading, error } = useProduct(Number(id));
  const addToCart = useCartStore((state) => state.addItem);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          Error loading product
        </h2>
        <p className="mb-4 text-gray-600">
          The product you&rsquo;re looking for might not exist or there was an error loading it.
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/cart');
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
        <span className="text-sm text-gray-500">
          / {product.category}
        </span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-white p-8">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {product.title}
          </h1>
          
          <div className="mb-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                {product.rating.rate}
              </span>
              <span>({product.rating.count} reviews)</span>
            </div>
          </div>

          <p className="mb-8 text-gray-700">{product.description}</p>

          <div className="mt-auto">
            <div className="mb-4 flex items-center gap-4">
              <label className="text-gray-700">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="rounded-md border border-gray-300 px-3 py-2"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 