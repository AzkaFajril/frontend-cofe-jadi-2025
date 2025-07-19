import { useProduct } from '@/hooks/useProduct';
import PopularCategoryList from './PopularCategoryList';

export default function PopularHotDrinkList() {
  // Product Provider
  const { hotDrinks } = useProduct();

  return (
    <PopularCategoryList
      title="Popular Hot Drink"
      coffees={hotDrinks?.slice(0, 4)}
    />
  );
}
