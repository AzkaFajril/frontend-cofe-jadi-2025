import { useParams } from 'react-router-dom';
import Title1 from '@/components/shared/typo/Title1';
import PageLoading from '@/components/shared/PageLoading';
import OrderSummary from './OrderSummary';
import OrderPaymentMethod from './OrderPaymentMethod';
import OrderInfos from './OrderInfos';
import useOrder from './useOrders';
import OrderQR from './OrderQR';

export default function OrderDetailPage() {
  // Params
  const { id } = useParams();
  const { data, isLoading } = useOrder(id);

  if (!isLoading && !data) {
    return <p>Error</p>;
  }

  const ORDER_TYPE_LABELS: Record<string, string> = {
    'in-place': 'In Place',
    'IN_PLACE': 'In Place',
    'delivery': 'Delivery',
    'DELIVERY': 'Delivery',
    'pickup': 'Pickup',
    'PICKUP': 'Pickup',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 border border-primary-200">
        <Title1 className="mb-4 text-center">Order Details</Title1>
        {data && (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <OrderQR />
              <div className="flex-1">
                <OrderInfos order={data} />
              </div>
            </div>
            <hr className="my-4 border-primary-100" />
            <OrderSummary order={data} />
            <hr className="my-4 border-primary-100" />
            <OrderPaymentMethod method={data.paymentMethod} />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 rounded-lg p-3 border">
                <b>Order ID</b>: <span className="text-primary-700">{data.orderId}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border">
                <b>Order Date</b>: <span className="text-primary-700">{data.date}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border">
                <b>Delivery Type</b>: <span className="text-primary-700">{data?.deliveryType || data?.deliOption || data?.orderType}</span>
                {/* Cetak alamat jika delivery */}
                {['delivery', 'DELIVERY'].includes((data?.orderType || data?.deliOption || data?.deliveryType)?.toLowerCase?.() || '') && (
                  <div className="mt-1">
                    <b>Delivery Address</b>: <span className="text-primary-700">{data.address || data.customer?.address || '-'}</span>
                  </div>
                )}
                {/* Tampilkan Table Number jika in-place */}
                {['in-place', 'IN_PLACE'].includes((data?.orderType || data?.deliOption || data?.deliveryType)?.toLowerCase?.()) && data.tableNumber && (
                  <div className="mt-1">
                    <b>Table Number</b>: <span className="text-primary-700">{data.tableNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <PageLoading show={isLoading} />
    </div>
  );
}
