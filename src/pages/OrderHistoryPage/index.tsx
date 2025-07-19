import Title1 from '@/components/shared/typo/Title1';
import OrderList from './OrderList';
import { useEffect, useState } from 'react';
import OrderCard from './OrderCard';

export default function OrderHistoryPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('https://serverc.up.railway.app/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);
  return (
    <div className="p-4">
      <Title1>Order History</Title1>
      <div className="mt-4">
        <OrderList products={products} />
      </div>
    </div>
  );
}
