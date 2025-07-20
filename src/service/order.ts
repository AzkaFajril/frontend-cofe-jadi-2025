import { v4 as uuidv4 } from 'uuid';
import { DeliveryOrder } from '@/types';
import { getCoffeeById } from './product';

const keyName = 'coffee-shop-orders';

const sortByDate = (list: DeliveryOrder[]): DeliveryOrder[] => {
  return list.sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    return bDate - aDate;
  });
};

export function getOrderList(): DeliveryOrder[] {
  try {
    const value = window.localStorage.getItem(keyName);
    if (value) {
      const orders = JSON.parse(value) as DeliveryOrder[];
      const sortedList = sortByDate(orders);

      return sortedList;
    }
    return [];
  } catch (err) {
    console.log('Error:: getOrderList :', err);
    return [];
  }
}

export async function getOrderById(id: string): Promise<DeliveryOrder | null> {
  try {
    const res = await fetch(`http://localhost:5000/api/orders/${id}`);
    if (!res.ok) return null;
    const order = await res.json();
    return order;
  } catch (err) {
    console.log('Error:: getOrderById :', err);
    return null;
  }
}

export function getOrderCount(): number {
  try {
    const orders = getOrderList();
    return orders?.length || 0;
  } catch (err) {
    console.log('Error:: getOrderCount :', err);
    return 0;
  }
}

const shortRandomUUID = (): string => {
  const uuid = uuidv4();
  return uuid.split('-').join('').substring(0, 8);
};

const makeFakeOrder = async (newOrder: TAddOrder): Promise<DeliveryOrder> => {
  const id = shortRandomUUID();
  const currentDate = new Date();
  const date = currentDate.toLocaleString('en-US');
  const firstItem = newOrder.items[0];
  let image = '';
  if (firstItem && firstItem.productId) {
    const product = await getCoffeeById(firstItem.productId);
    image = product.image;
  }
  return {
    ...newOrder,
    id,
    date,
    image,
  };
};

export type TAddOrder = Omit<DeliveryOrder, 'id' | 'date' | 'image'>;

export function addOrder(newOrder: TAddOrder): DeliveryOrder | null {
  try {
    const oldOrders = getOrderList();
    const order = makeFakeOrder(newOrder);
    const mergeData: DeliveryOrder[] = [...oldOrders, order];

    window.localStorage.setItem(keyName, JSON.stringify(mergeData));

    return order;
  } catch (err) {
    console.log('Error:: addOrder :', err);

    return null;
  }
}

export function removeAllOrders(): void {
  try {
    window.localStorage.removeItem(keyName);
  } catch (err) {
    console.log('Error:: removeAllOrders :', err);
  }
}

export async function createOrder(orderData) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('Anda harus login terlebih dahulu!');
    throw new Error('User belum login');
  }
  // Validasi orderData sebelum kirim
  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    alert('Keranjang kosong!');
    throw new Error('Items kosong');
  }
  if (!orderData.paymentMethod) {
    alert('Pilih metode pembayaran!');
    throw new Error('paymentMethod kosong');
  }
  if (!orderData.totalPayment) {
    alert('Total pembayaran kosong!');
    throw new Error('totalPayment kosong');
  }
  const res = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...orderData, userId }),
  });
  if (!res.ok) {
    const err = await res.json();
    alert(err.message || 'Gagal membuat order');
    throw new Error(err.message || 'Gagal membuat order');
  }
  return res.json();
}

export async function getOrderHistoryByUser(userId: string) {
  const res = await fetch(`http://localhost:5000/api/orders/by-user?userId=${userId}`);
  if (!res.ok) throw new Error('Gagal mengambil order history');
  return res.json();
}
