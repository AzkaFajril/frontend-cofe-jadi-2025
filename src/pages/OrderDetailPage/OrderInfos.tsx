import LabelValueRow from '@/components/shared/LabelValueRow';
import { DeliOption, DeliveryOrder } from '@/types';

interface OrderInfosProps {
  order: DeliveryOrder;
}
export default function OrderInfos({ order }: OrderInfosProps) {
  // Fungsi format rupiah tanpa desimal
  const formatRupiahTanpaDesimal = (amount: number) => {
    return 'Rp ' + amount.toLocaleString('id-ID', { maximumFractionDigits: 0 });
  };

  return (
    <div className="mt-4">
      <LabelValueRow lable="Order ID" value={`#${order.orderId}`} />
      <LabelValueRow lable="Order Date" value={order.date} />
      <LabelValueRow lable="Delivery Type" value={(order as any).deliveryType || order.orderType || order.deliOption || '-'} />

      {/* Tampilkan alamat jika delivery */}
      {['DELIVER', 'DELIVERY', 'delivery', 'deliver'].includes(order.orderType || order.deliOption) ? (
        <LabelValueRow lable="Delivery Address" value={(order as any).address || order.customer?.address || '-'} />
      ) : ['IN_PLACE', 'in-place'].includes(order.orderType || order.deliOption) ? (
        <>
          <LabelValueRow lable="Delivery Type" value="In Place" />
        </>
      ) : (
        // Tampilkan Table Number jika in-place
        ['in_place', 'in-place'].includes((order.orderType || order.deliOption)?.toLowerCase?.()) && !!order.tableNumber && (
          <div className="mt-1">
            <b>Table Number</b>: <span className="text-primary-700 float-right">{order.tableNumber}</span>
          </div>
        )
      )}
      <LabelValueRow lable="Total Payment" value={formatRupiahTanpaDesimal(order.totalPayment)} />
    </div>
  );
}
