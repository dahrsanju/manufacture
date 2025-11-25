// Mock Products Service
// Uses MSW handlers for API interception

import axios from 'axios';
import type { Product, PaginatedResponse, QueryParams } from '@/types';

const API_BASE = '/api/v1/products';

export interface ProductService {
  getProducts: (params?: QueryParams) => Promise<PaginatedResponse<Product>>;
  getProduct: (id: string) => Promise<Product>;
  createProduct: (data: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
}

export const getProducts = async (params?: QueryParams): Promise<PaginatedResponse<Product>> => {
  const response = await axios.get(API_BASE, { params });
  return response.data.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data.data;
};

export const createProduct = async (data: Partial<Product>): Promise<Product> => {
  const response = await axios.post(API_BASE, data);
  return response.data.data;
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
  const response = await axios.put(`${API_BASE}/${id}`, data);
  return response.data.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};
