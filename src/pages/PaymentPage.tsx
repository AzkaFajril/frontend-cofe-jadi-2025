import React, { useState } from 'react';

const API_URL = 'https://server-production-0205.up.railway.app/';

const PaymentPage = () => {
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearCart = () => {
    // Implement cart clearing logic or wire to your cart context/store
  };

  const handleConfirm = async (
    orderData: Record<string, unknown>,
    _orderType: string
  ) => {
    setLoading(true);
    const endpoint = `${API_URL}/api/orders`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        setSuccess(true);
        clearCart();
      } else {
        const err = await res.json();
        setError(err.message || 'Gagal menyimpan order!');
      }
    } catch (_err) {
      setError('Gagal menyimpan order!');
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Payment page content */}
      {loading && <p>Memproses pembayaran...</p>}
      {success && <p>Pembayaran berhasil!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PaymentPage;
