import { useProduct } from '@/hooks/useProduct';
import PopularCategoryList from './PopularCategoryList';

export default function PopularHotDrinkList() {
  // Product Provider
  const { desserts } = useProduct();

  return (
    <PopularCategoryList
      title="Popular DESSERTS"
      coffees={desserts?.slice(0, 4)}
    />
  );
}