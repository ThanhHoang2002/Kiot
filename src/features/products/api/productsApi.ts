import axios from 'axios';

import { Product } from '../types';

const BASE_URL = 'https://fakestoreapi.com';

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getById: async (id: number): Promise<Product> => {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data;
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await axios.get(`${BASE_URL}/products/category/${category}`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await axios.get(`${BASE_URL}/products/categories`);
    return response.data;
  }
}; 