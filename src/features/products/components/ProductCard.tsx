import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Product } from '../types';


interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-sm overflow-hidden rounded bg-white shadow-lg" onClick={() => navigate(`/products/${product.id}`)}>
      <img className="h-48 w-full object-contain p-4" src={product.image} alt={product.title} />
      <div className="px-6 py-4">
        <div className="mb-2 truncate text-xl font-bold" title={product.title}>{product.title}</div>
        <p className="line-clamp-2 text-base text-gray-700">{product.description}</p>
      </div>
      <div className="px-6 pb-2 pt-4">
        <span className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
          ${product.price}
        </span>
        <span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
          ⭐ {product.rating.rate} ({product.rating.count})
        </span>
      </div>
    </div>
  );
}; 