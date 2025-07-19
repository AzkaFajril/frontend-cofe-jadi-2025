import React from 'react';

const PAYMENT_LABELS = {
  cash: 'Cash',
  qr: 'QR Code',
  card: 'Credit/Debit Card',
};

export default function OrderPaymentMethod({ paymentMethod }: { paymentMethod: string }) {
  return (
    <div>
      <span>Metode Pembayaran: </span>
      <span className="font-semibold">
        {PAYMENT_LABELS[paymentMethod] || paymentMethod}
      </span>
    </div>
  );
} 