import { DeliveryOrder } from '@/types';

interface OrderSummaryProps {
  order: DeliveryOrder;
}

function formatRupiah(amount: number | string | undefined) {
  if (amount == null || isNaN(Number(amount))) return '-';
  return `Rp ${Number(amount).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  if (!order) return null;

  // Hitung total keseluruhan
  const totalAll = order.items.reduce((acc: number, item: any) => acc + (Number(item.price) * Number(item.quantity || 0)), 0);

  return (
    <div>
      <h4>Summary</h4>
      <div style={{ display: 'flex', fontWeight: 'bold', marginBottom: 8, minWidth: 350 }}>
        <div style={{ flex: 1 }}>Product</div>
        <div style={{ width: 40 }}>Qty</div>
        <div style={{ width: 80, textAlign: 'right' }}>per each</div>
        <div style={{ width: 100, textAlign: 'right' }}>Total</div>
      </div>
      {order.items.map((item: any, idx: number) => (
        <div key={idx} style={{ display: 'flex', marginBottom: 4, minWidth: 350 }}>
          <div style={{ flex: 1 }}>
            {item.productName}
            {item.size && (
              <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>
                ({item.size})
              </span>
            )}
          </div>
          <div style={{ width: 40 }}>{item.quantity ?? '-'}</div>
          <div style={{ width: 80, textAlign: 'right' }}>{formatRupiah(item.price)}</div>
          <div style={{ width: 100, textAlign: 'right' }}>{formatRupiah(Number(item.price) * Number(item.quantity ?? 0))}</div>
        </div>
      ))}
     
    </div>
  );
}