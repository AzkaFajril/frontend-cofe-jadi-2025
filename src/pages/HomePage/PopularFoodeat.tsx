import { useProduct } from '@/hooks/useProduct';
import PopularCategoryList from './PopularCategoryList';

export default function PopularHotDrinkList() {
  // Product Provider
  const { food } = useProduct();

  return (
    <PopularCategoryList
      title="Popular Food / Eat"
      coffees={food?.slice(0, 4)}
    />
  );
}
