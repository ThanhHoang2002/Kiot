import { Product, ProductsParams, ProductsResponse } from '../types/product';

const generateMockProducts = (): Product[] => {
  const categories = [
    'Thực phẩm ăn liền',
    'Đồ uống có cồn',
    'Bánh kẹo',
    'Nước giải khát',
    'Sữa các loại',
    'Gia vị',
    'Đồ dùng gia đình'
  ];

  const productNames = [
    'Mì tôm Hảo Hảo',
    'Bia Tiger',
    'Bánh Oreo',
    'Coca Cola',
    'Sữa Vinamilk',
    'Nước mắm Nam Ngư',
    'Nước rửa chén Sunlight',
    'Mì gói Omachi',
    'Rượu Chivas',
    'Kẹo dẻo Haribo',
    'Pepsi',
    'Sữa TH True Milk',
    'Dầu ăn Neptune',
    'Bột giặt Omo'
  ];

  const products: Product[] = [];
  
  // Thêm 50 sản phẩm mẫu
  for (let i = 1; i <= 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const productName = productNames[Math.floor(Math.random() * productNames.length)];
    const quantity = Math.floor(Math.random() * 100);
    const costPrice = Math.floor(Math.random() * 900000) + 100000;
    const sellPrice = Math.floor(costPrice * (1 + Math.random() * 0.5)); // Giá bán cao hơn 0-50%

    products.push({
      id: i.toString(),
      code: `SP${String(i).padStart(6, '0')}`,
      name: `${productName} ${i}`,
      sellPrice,
      costPrice,
      quantity,
      status: quantity > 0 ? 'in_stock' : 'out_of_stock',
      createdAt: new Date(2024, 1, Math.floor(Math.random() * 28) + 1).toISOString(),
      category,
    });
  }

  return products;
};

const mockProductsData: Product[] = generateMockProducts();

type SortableField = keyof Pick<Product, 'name' | 'code' | 'sellPrice' | 'costPrice' | 'quantity' | 'createdAt'>;

export const mockProducts = (params: ProductsParams): Promise<ProductsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredProducts = [...mockProductsData];

      // Apply search - Tìm kiếm không phân biệt hoa thường và dấu
      if (params.search) {
        const searchTerm = params.search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        filteredProducts = filteredProducts.filter(product => {
          const normalizedName = product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const normalizedCode = product.code.toLowerCase();
          return normalizedName.includes(searchTerm) || normalizedCode.includes(searchTerm);
        });
      }

      // Apply category filter
      if (params.category) {
        filteredProducts = filteredProducts.filter(
          product => product.category === params.category
        );
      }

      // Apply status filter
      if (params.status) {
        filteredProducts = filteredProducts.filter(
          product => product.status === params.status
        );
      }

      // Apply sorting
      if (params.sortBy) {
        const sortField = params.sortBy as SortableField;
        filteredProducts.sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];
          
          if (params.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedProducts = filteredProducts.slice(start, end);

      resolve({
        data: paginatedProducts,
        total: filteredProducts.length,
        page,
        limit,
      });
    }, 500); // 500ms delay
  });
}; 