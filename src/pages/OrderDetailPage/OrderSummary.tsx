export default function OrderSummary({ order }: OrderSummaryProps) {
  if (!order) return null; // atau tampilkan loading/error

  return (
    <div>
      <h4>Order Summary</h4>
      <div style={{ display: 'flex', fontWeight: 'bold', marginBottom: 8 }}>
        <div style={{ width: 40 }}>Qty</div>
        <div style={{ flex: 1 }}>Product</div>
        <div style={{ width: 80, textAlign: 'right' }}>per each</div>
        <div style={{ width: 100, textAlign: 'right' }}>Total</div>
      </div>
      {order.items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', marginBottom: 4 }}>
          <div style={{ width: 40 }}>{item.quantity}x</div>
          <div style={{ flex: 1 }}>
            {item.productName}
            {item.size && (
              <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>
                ({item.size})
              </span>
            )}
          </div>
          <div style={{ width: 80, textAlign: 'right' }}>
            {item.price != null
              ? `Rp ${Number(item.price).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`
              : '-'}
          </div>
          <div style={{ width: 100, textAlign: 'right' }}>
            {item.price != null
              ? `Rp ${(Number(item.price) * (item.quantity ?? 1)).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`
              : '-'}
          </div>
        </div>
      ))}
    </div>
  );
}