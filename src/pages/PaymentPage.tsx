import React, { useState } from 'react';

const API_URL = 'https://serverc.up.railway.app';

const PaymentPage = () => {
  const handleConfirm = async (orderData, orderType) => {
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
    } catch (err) {
      setError('Gagal menyimpan order!');
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Payment page content */}
    </div>
  );
};

export default PaymentPage;
