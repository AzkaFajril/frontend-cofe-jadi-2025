import axios from 'axios';
import { CoffeeProduct } from '@/types';

const API_URL = 'https://sekola-backend-production-bd7d.up.railway.app/products';

export async function getAllCoffee(): Promise<CoffeeProduct[]> {
  const res = await fetch('https://sekola-backend-production-bd7d.up.railway.app/products');
  return res.json();
}

export async function getCoffeeById(id: string): Promise<CoffeeProduct> {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
}

export const createProduct = async (productData: any, token: string) => {
  const response = await axios.post(
    'https://sekola-backend-production-bd7d.up.railway.app/admin/products',
    productData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

export async function fetchProducts() {
  const res = await axios.get('https://sekola-backend-production-bd7d.up.railway.app/product');
  // Pastikan setiap produk punya field id yang unik
  return res.data.map((item: any) => ({
    ...item,
    id: item._id || item.id, // gunakan _id dari MongoDB jika ada
  }));
}
