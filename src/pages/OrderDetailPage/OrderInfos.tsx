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
      {order.deliOption === DeliOption.DELIVER ? (
        <LabelValueRow lable="Delivery Address" value={order.customer?.address || '-'} />
      ) : order.deliOption === DeliOption.IN_PLACE ? (
        <>
          <LabelValueRow lable="Delivery Type" value="in place" />
          {order.tableNumber && (
            <LabelValueRow lable="Table Number" value={order.tableNumber} />
          )}
        </>
      ) : (
        <LabelValueRow lable="Delivery Type" value="Self Pick-up" />
      )}
      <LabelValueRow lable="Total Payment" value={formatRupiahTanpaDesimal(order.totalPayment)} />
    </div>
  );
}
