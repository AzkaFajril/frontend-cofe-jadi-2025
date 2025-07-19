import Title6 from '@/components/shared/typo/Title6';

const PAYMENT_LABELS: { [key: string]: string } = {
  dana: 'DANA',
  gopay: 'GoPay',
  shopeepay: 'ShopeePay',
  credit_card: 'Kartu Kredit/Debit',
  bank_transfer: 'Virtual Account',
  cod: 'Cash on Delivery',
  midtrans: 'Midtrans',
  cash: 'Cash',
  qr: 'QR Code',
  card: 'Credit/Debit Card',
};

export default function OrderPaymentMethod({ method }: { method?: string }) {
  const label = method ? (PAYMENT_LABELS[method] || method) : '-';
  return (
    <div>
      <Title6 className="mb-3">Payment Method</Title6>
      <div className="flex p-2 bg-white text-primary font-semibold border border-primary rounded-xl">
        <div className="flex w-full items-center justify-between">
          <p>{label}</p>
        </div>
      </div>
    </div>
  );
}
