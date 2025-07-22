import { useProduct } from '@/hooks/useProduct';
import ProductsByCategory from './ProductsByCategory';

export default function FoodList() {
  // Product Provider
  const { food } = useProduct();

  return <ProductsByCategory title="Food / Eat/" coffees={food} />;
}
