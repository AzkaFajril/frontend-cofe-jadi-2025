import { useProduct } from '@/hooks/useProduct';
import ProductsByCategory from './ProductsByCategory';

export default function dessertsList() {
  // Product Provider
  const { desserts } = useProduct();

  return <ProductsByCategory title="Desserts" coffees={desserts} />;
}
