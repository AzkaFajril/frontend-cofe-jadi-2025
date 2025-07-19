import { useShoppingCart } from '@/hooks/useShoppingCart';
import Title6 from '@/components/shared/typo/Title6';
import PriceRow from '@/components/shared/PriceRow';

export default function PaymentSummary() {
  // Shopping Cart
  const { subTotal, deliFee, items } = useShoppingCart();

  // Helper untuk format rupiah
  const formatRupiah = (amount: number) =>
    `Rp${Number(amount).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;

  return (
    <div>
      <Title6 className="mb-2">Payment Summary</Title6>
      <PriceRow lable="Sub Total" amount={subTotal} />
      {!!deliFee && <PriceRow lable="Delivery Fee" amount={deliFee} />}
      <PriceRow lable="Total" amount={subTotal + deliFee} />
      {/* Tampilkan harga satuan (each) */}
      {items.length === 1 && items[0].product?.price && items[0].product.price > 0 && (
        <div className="text-sm text-gray-500 mt-1">{formatRupiah(items[0].product.price)} each</div>
      )}
      {items.length > 1 && (
        <div className="text-xs text-gray-500 mt-1">
          {items.map((item, idx) => (
            item.product.price && item.product.price > 0 ? (
              <div key={idx}>
                {item.product.displayName}: {formatRupiah(item.product.price)} each
              </div>
            ) : null
          ))}
        </div>
      )}
    </div>
  );
}
