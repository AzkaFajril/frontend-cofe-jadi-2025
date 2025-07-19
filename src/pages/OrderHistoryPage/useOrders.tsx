import { useEffect, useState } from 'react';
import { getOrderHistoryByUser } from '@/service/order';

export default function useOrders() {
  const [data, setData] = useState([]);
  const [isLoading, setLoding] = useState(false);
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

  useEffect(() => {
    function handleStorageChange() {
      setUserId(localStorage.getItem('userId'));
    }
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!userId) {
      setData([]); // Kosongkan data jika userId tidak ada (logout)
      setLoding(false);
      return;
    }
    setLoding(true);
    getOrderHistoryByUser(userId)
      .then((orders) => {
        setData(orders);
        setLoding(false);
      })
      .catch(() => {
        setData([]);
        setLoding(false);
      });
  }, [userId]);

  return { data, isLoading };
}
