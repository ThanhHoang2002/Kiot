import { Product, ProductsParams, ProductsResponse } from '../types/product';
import { mockProducts } from '../utils/mockData';

export const fetchProducts = async (params: ProductsParams): Promise<ProductsResponse> => {
  // TODO: Replace with actual API call
  return mockProducts(params);
};

export const fetchDetailsProducts = async (id: string): Promise<Product> => {
  // Giả lập delay API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Lấy mock data từ hàm mockProducts
  const { data } = await mockProducts({ page: 1, limit: 100 });
  
  // Tìm sản phẩm theo id
  const product = data.find((product) => product.id === id);

  return product as Product;
}

export const updateProduct = async (id: string, updateData: Partial<Product>): Promise<Product> => {
  // Giả lập delay API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Lấy mock data hiện tại
  const { data } = await mockProducts({ page: 1, limit: 100 });
  
  // Tìm và cập nhật sản phẩm
  const productIndex = data.findIndex((product) => product.id === id);
  
  if (productIndex === -1) {
    throw new Error('Product not found');
  }

  // Cập nhật sản phẩm với dữ liệu mới
  const updatedProduct = {
    ...data[productIndex],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  // Trong thực tế, bạn sẽ cần cập nhật vào database
  // Ở đây chúng ta chỉ trả về sản phẩm đã cập nhật
  return updatedProduct;
}