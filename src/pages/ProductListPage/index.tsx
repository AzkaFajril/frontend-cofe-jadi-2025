import SearchProduct from './SearchProduct';
import HotDrinkList from './HotDrinkList';
import ColdDrinkList from './ColdDrinkList';
import DessertsList from './desserts';
import FoodList from './Food';

export default function ProductListPage() {
  return (
    <div className="p-3">
      <SearchProduct />
      <HotDrinkList />
      <ColdDrinkList />
      <FoodList />
      <DessertsList />
    </div>
  );
}
