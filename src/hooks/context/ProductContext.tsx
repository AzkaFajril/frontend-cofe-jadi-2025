import { createContext } from 'react';
import { CoffeeProduct } from '@/types';

interface ProductContextProps {
  coffees: CoffeeProduct[];
  icedCoffees: CoffeeProduct[];
  hotDrinks: CoffeeProduct[];
  desserts: CoffeeProduct[];
  food: CoffeeProduct[];
}

const ProductContext = createContext<ProductContextProps | null>(null);

export default ProductContext;
