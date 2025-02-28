import React from 'react';

import { ProductList } from '@/features/products/components/ProductList';

const Products: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">Our Products</h1>
        <ProductList />
      </div>
    </div>
  );
};

export default Products; 