import { useEffect, useState } from 'react';
import { DeliveryOrder } from '@/types';
import { fakeTimer } from '@/utils/helper';
import { getOrderById } from '@/service/order';

export default function useOrder(id: string | undefined) {
  const [data, setData] = useState<DeliveryOrder | null>(null);
  const [isLoading, setLoding] = useState(false);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoding(false);
      return;
    }
    const getData = async () => {
      setLoding(true);
      await fakeTimer(1000);
      const res = await getOrderById(id);
      if(res){
        setData(res);
      } else {
        setData(null);
      }
      setLoding(false);
    };
      getData();
  }, [id]);

  return { data, isLoading };
}
