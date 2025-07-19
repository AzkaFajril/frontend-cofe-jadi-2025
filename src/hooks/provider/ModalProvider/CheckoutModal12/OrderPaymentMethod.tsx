import React from 'react';

const PAYMENT_LABELS: { [key: string]: string } = {
  cash: 'Cash',
  qr: 'QR Code',
  card: 'Credit/Debit Card',
  midtrans: 'Midtrans (E-Wallet/VA)',
  cod: 'Cash on Delivery (COD)',
};

export default function OrderPaymentMethod({ paymentMethod }: { paymentMethod?: string }) {
  const method = paymentMethod || 'midtrans';
  return (
    <div>
      <span>Metode Pembayaran: </span>
      <span className="font-semibold">
        {PAYMENT_LABELS[method] || method}
      </span>
    </div>
  );
} 