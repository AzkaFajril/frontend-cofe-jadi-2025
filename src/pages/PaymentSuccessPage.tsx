import React from 'react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-green-500 text-5xl mb-4">✔️</div>
        <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h2>
        <p className="text-gray-600 mb-6">Terima kasih, pesanan Anda telah diterima dan sedang diproses.</p>
        <a href="/orders" className="text-blue-600 underline">Lihat Riwayat Pesanan</a>
        <br />
        <a href="/" className="text-gray-600 underline text-sm">Kembali ke Beranda</a>
      </div>
    </div>
  );
} 