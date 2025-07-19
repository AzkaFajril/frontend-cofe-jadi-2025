import React, { ReactNode, useEffect, useMemo } from 'react';
import { CoffeeProduct, CoffeeType } from '@/types';
import { getAllCoffee } from '@/service/product';
import ProductContext from '../context/ProductContext';

interface ProductProviderProps {
  children: ReactNode;
}

const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [coffees, setCoffees] = React.useState<CoffeeProduct[]>([]);
  const icedCoffees: CoffeeProduct[] = coffees?.filter(
    (c) => c.type === CoffeeType.Iced
  );
  const hotCoffees: CoffeeProduct[] = coffees?.filter(
    (c) => c.type === CoffeeType.Hot
  );
  const hotDrinks: CoffeeProduct[] = coffees?.filter((c) => c.category && c.category.toLowerCase() === 'hotdrinks');
  const foodItems: CoffeeProduct[] = coffees?.filter((c) => c.category === 'food');
  const dessertItems: CoffeeProduct[] = coffees?.filter((c) => c.category === 'dessert');
  const isHot: CoffeeProduct[] = coffees?.filter((c) => c.type === CoffeeType.Hot);
  const desserts: CoffeeProduct[] = coffees?.filter((c) => c.category === 'dessert' || c.category === 'desserts');
  const coldDrinks: CoffeeProduct[] = coffees?.filter((c) => c.category === 'coldDrinks');
  const food: CoffeeProduct[] = coffees?.filter((c) => c.category === 'food');

  // Get Coffee List
  useEffect(() => {
    async function loadProducts() {
      const data = await getAllCoffee();
      setCoffees(data); // data sudah pasti id unik
    }
    loadProducts();
  }, []);

  const value = useMemo(
    () => ({
      coffees,
      icedCoffees,
      hotCoffees,
      foodItems,
      dessertItems,
      isHot,
      desserts,
      coldDrinks,
      hotDrinks,
      food,
    }),
    [coffees]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductProvider;
