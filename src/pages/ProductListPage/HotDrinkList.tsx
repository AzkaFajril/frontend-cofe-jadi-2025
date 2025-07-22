import { useProduct } from '@/hooks/useProduct';
import ProductsByCategory from './ProductsByCategory';

export default function HotDrinkList() {
  // Product Provider
  const { hotDrinks } = useProduct();

  return <ProductsByCategory title="Hot Drink" coffees={hotDrinks} />;
}
