import React, { useState } from 'react';
import PageLoading from '@/components/shared/PageLoading';
import { classNames } from '@/utils/helper';
import OrderCard from './OrderCard';
import useOrders from './useOrders';
import EmptyOrder from './EmptyOrder';

export default function OrderList({ products = [] }: { products: any[] }) {
  const { data, isLoading } = useOrders();
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<'all' | 'in-place' | 'delivery' | 'pickup'>('all');
  // Filter order: tampilkan jika (status 'completed' atau 'processing') untuk semua paymentMethod,
  // atau status 'pending' khusus untuk paymentMethod 'cod'
  const completedOrders = data.filter((order: any) =>
    (order.status === 'completed' || order.status === 'processing') ||
    (order.status === 'pending' && order.paymentMethod === 'cod')
  )
  // Filter delivery type
  .filter((order: any) => {
    const type = (order.deliveryType || order.orderType || order.deliOption || '').toLowerCase();
    if (deliveryTypeFilter === 'all') return true;
    if (deliveryTypeFilter === 'in-place') return type === 'in-place' || type === 'in_place';
    if (deliveryTypeFilter === 'delivery') return type === 'delivery';
    if (deliveryTypeFilter === 'pickup') return type === 'pickup' || type === 'pick_up';
    return true;
  });
  // Urutkan order dari yang terbaru ke terlama
  completedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const orderCount = completedOrders.length;

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium">Filter Delivery Type:</label>
        <select
          value={deliveryTypeFilter}
          onChange={e => setDeliveryTypeFilter(e.target.value as any)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="in-place">In Place</option>
          <option value="delivery">Delivery</option>
          <option value="pickup">Pick Up</option>
        </select>
      </div>
      {!isLoading && (
        <div className="w-full">
          {orderCount > 0 ? (
            <ul>
              {completedOrders?.map((order, index) => (
                <li
                  key={index}
                  className={classNames(
                    'py-2',
                    index !== orderCount - 1
                      ? 'border-b border-primary-200'
                      : ''
                  )}
                >
                  <OrderCard order={order} products={products} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyOrder />
          )}
        </div>
      )}
      <PageLoading show={isLoading} />
    </>
  );
}
