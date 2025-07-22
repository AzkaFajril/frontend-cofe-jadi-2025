import React from 'react';

interface PendingPaymentProps {
  order: any; // Ganti dengan tipe order kamu jika ada
  onPayAgain: (order: any) => void;
}

export default function PendingPayment({ order, onPayAgain }: PendingPaymentProps) {
  // Cek status payment
  const isPaidButNotComplete = order.status === 'paid';

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-yellow-700">
            Pembayaran Pending
            {order.status && (
              <span className="ml-2 text-xs text-yellow-800 bg-yellow-200 px-2 py-0.5 rounded">
                {order.status.toUpperCase()}
              </span>
            )}
          </div>
          <div className="text-gray-700">Order ID: {order.orderId || '-'}</div>
          <div className="text-gray-700">
            Total: Rp {order.totalPayment ? order.totalPayment.toLocaleString('id-ID') : '-'}
          </div>
          {isPaidButNotComplete && (
            <div className="text-red-600 font-semibold mt-2">
              Payment belum selesai
            </div>
          )}
        </div>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold"
          onClick={() => onPayAgain(order)}
        >
          Bayar Lagi
        </button>
      </div>
    </div>
  );
}