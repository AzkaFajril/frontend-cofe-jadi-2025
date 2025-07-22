import { DeliveryOrder } from '@/types';
import { priceWithSign } from '@/utils/helper';
import { Link } from 'react-router-dom';

interface OrderCardProps {
  order: DeliveryOrder;
  products: any[];
}

export default function OrderCard({ order, products }: OrderCardProps) {

  const orderItemsText = order?.items?.map((i)=>`${i.quantity}x ${i.productName}`)?.join(", ");
  // Ambil image dari produk berdasarkan productId item pertama
  let image = order.image;
  if (order.items && order.items.length > 0) {
    const firstProductId = order.items[0]?.productId;
    const product = products.find(p => String(p.id) === String(firstProductId) || String(p._id) === String(firstProductId));
    image = product?.image || order.image || '/images/empty-folder.png';
  }
  // Mapping label delivery type
  const DELIVERY_TYPE_LABELS: Record<string, string> = {
    'in-place': 'In Place',
    'IN_PLACE': 'In Place',
    'delivery': 'Delivery',
    'DELIVERY': 'Delivery',
    'pickup': 'Pick Up',
    'PICKUP': 'Pick Up',
  };
  return (
    <Link
      to={`/orders/${order._id}`}
      className="w-full flex gap-2 bg-white hover:bg-primary-50 p-1 rounded-lg"
    >
      <div className="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden">
        <img
          src={image}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full flex flex-col gap-1 justify-between">
        <div className="flex justify-between gap-2 font-semibold">
          <h6 className="text-gray-800 line-clamp-1">{`#${order.orderId}`}</h6>
          <p className="text-primary">{priceWithSign(order.totalPayment)}</p>
        </div>
        <span className="text-gray-400 text-xs font-semibold">
          {order.date}
        </span>
        {/* Tampilkan status dan payment method */}
        <div className="flex gap-2 text-xs mt-1">
          <span className={`font-bold ${order.statusPesanan === 'sudah_dikirim' ? 'text-green-600' : order.statusPesanan === 'belum_dikirim' ? 'text-yellow-600' : order.statusPesanan === 'sedang_diproses' ? 'text-blue-600' : 'text-red-600'}`}>{order.statusPesanan?.toUpperCase()}</span>
          <span className="text-gray-500">|</span>
          <span className="font-semibold text-gray-700">{order.paymentMethod?.toUpperCase() || '-'}</span>
          <span className="text-gray-500">|</span>

          <span className={`font-bold ${order.status === 'completed' ? 'text-green-600' : order.status === 'pending' ? 'text-yellow-600' : order.status === 'processing' ? 'text-blue-600' : 'text-red-600'}`}>{order.status?.toUpperCase()}</span>
          <span className="text-gray-500">|</span>
          <span className="font-semibold">{DELIVERY_TYPE_LABELS[order.deliveryType || order.orderType || order.deliOption] || order.deliveryType || order.orderType || order.deliOption || '-'}</span>

        </div>
        
      </div>
    </Link>
  );
}
