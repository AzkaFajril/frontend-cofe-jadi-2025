import React, { useState, useEffect } from 'react';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import Title2 from '@/components/shared/typo/Title2';
import Title3 from '@/components/shared/typo/Title3';
import TableQRScanner from '@/components/shared/TableQRScanner';
import PaymentSummary from '@/hooks/provider/ModalProvider/CartModal/PaymentSummary';

const ORDER_TYPES = [
  { value: 'in-place', label: 'In Place' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'pickup', label: 'Pickup' },
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'qr', label: 'QR Code' },
  { value: 'card', label: 'Credit/Debit Card' },
];

const API_URL = 'http://localhost:5000';

const ORDER_TYPE_LABELS: Record<string, string> = {
  'in-place': 'In Place',
  'delivery': 'Delivery',
  'pickup': 'Pickup',
};

const fetchProducts = async () => {
  const res = await fetch('http://localhost:5000/products');
  return res.json();
};

export default function PaymentPage() {
  const { items, totalPayment, clearCart } = useShoppingCart();
  const [orderType, setOrderType] = useState('in-place');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [address, setAddress] = useState('');
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [mappedItems, setMappedItems] = useState<any[]>([]);

  // Update mappedItems setiap items berubah
  useEffect(() => {
    const fetchAndMap = async () => {
      const res = await fetch('http://localhost:5000/products');
      const allProducts = await res.json();
      const mapped = items.map(item => {
        // Cocokkan id produk baik id maupun _id, toleran tipe
        const product = allProducts.find((p: any) => p.id == item.product.id || p._id == item.product.id);
        let price = product?.price;
        if (product?.sizes && item.size) {
          const sizeObj = product.sizes.find((s: any) => s.name.toLowerCase() === item.size.toLowerCase());
          price = sizeObj ? sizeObj.price : product.price;
        }
        return {
          ...item,
          price: price ?? 0,
          image: product?.image,
          productName: product?.displayName || item.product.displayName,
        };
      });
      setMappedItems(mapped);
    };
    fetchAndMap();
  }, [items]);

  // Fetch address from API when orderType is delivery
  useEffect(() => {
    if (orderType === 'delivery') {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      setAddressLoading(true);
      fetch(`${API_URL}/api/address/${userId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          setAddress(data?.fullAddress || '');
          setAddressLoading(false);
        })
        .catch(() => setAddressLoading(false));
    }
  }, [orderType]);

  const handleConfirm = async () => {
    setError('');
    if (orderType === 'delivery' && !address.trim()) {
      setError('Alamat wajib diisi untuk delivery!');
      return;
    }
    if (orderType === 'in-place' && !tableNumber.trim()) {
      setError('Nomor meja wajib diisi untuk in place!');
      return;
    }
    setLoading(true);
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Anda harus login terlebih dahulu!');
      setLoading(false);
      return;
    }
    // Ambil data produk asli
    const allProducts = await fetchProducts();
    // Mapping items dengan harga dari produk asli
    const mappedItems = items.map(item => {
      const product = allProducts.find((p) => p.id == item.product.id || p._id == item.product.id);
      let price = product?.price;
      if (product?.sizes && item.size) {
        const sizeObj = product.sizes.find((s) => s.name.toLowerCase() === item.size.toLowerCase());
        price = sizeObj ? sizeObj.price : product.price;
      }
      return {
        productId: item.product.id,
        productName: item.product.displayName,
        size: item.size,
        quantity: item.quantity,
        price: price ?? 0,
        image: product?.image,
      };
    });
    // Hitung ulang totalPayment dari mappedItems
    const totalPayment = mappedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const orderData = {
      userId,
      items: mappedItems,
      totalPayment, // gunakan hasil hitung ulang!
      paymentMethod,
      orderType: orderType.toUpperCase(),
      address: orderType === 'delivery' ? address : undefined,
      tableNumber: orderType === 'in-place' ? tableNumber : undefined,
      date: new Date().toLocaleString('en-US'),
      customer: orderType === 'delivery' ? { address } : undefined,
    };
    // Cetak price per item untuk debug
    console.log('Order items (price per item):', orderData.items.map(i => ({ productName: i.productName, size: i.size, price: i.price })));
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

  const handleSaveAddress = async () => {
    setAddressLoading(true);
    const userId = localStorage.getItem('userId');
    await fetch(`${API_URL}/api/address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, fullAddress: address }),
    });
    setEditingAddress(false);
    setAddressLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-500 text-5xl mb-4">✔️</div>
          <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h2>
          <p className="text-gray-600 mb-6">Terima kasih, pesanan Anda telah diterima.</p>
          <ButtonFilled onClick={() => window.location.href = '/'}>Kembali ke Beranda</ButtonFilled>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 flex flex-col items-center">
      <div className="w-full max-w-md rounded-lg shadow-md p-6">
        <Title2 className="mb-4 text-center">Pembayaran</Title2>
        {/* Pilihan Tipe Order */}
        <div className="mb-6">
          <Title3 className="mb-2">Tipe Order</Title3>
          <div className="flex gap-2 flex-wrap bg-gray-100 rounded-xl p-1">
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${orderType === 'in-place' ? 'bg-green-700 text-black' : 'bg-white text-gray-700 hover:bg-green-100'}`}
              onClick={() => setOrderType('in-place')}
              type="button"
            >
              In Place
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${orderType === 'delivery' ? 'bg-green-700 text-black' : 'bg-white text-gray-700 hover:bg-green-100'}`}
              onClick={() => setOrderType('delivery')}
              type="button"
            >
              Delivery
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${orderType === 'pickup' ? 'bg-green-700 text-black' : 'bg-white text-gray-700 hover:bg-green-100'}`}
              onClick={() => setOrderType('pickup')}
              type="button"
            >
              Pick Up
            </button>
          </div>
        </div>
        {/* Input Nomor Meja jika In Place */}
        {orderType === 'in-place' && (
          <div className="mb-6">
            <Title3 className="mb-2">Nomor Meja</Title3>
            
            {/* Hanya scan QR, tidak ada input manual */}
            <ButtonFilled
              className="mt-2"
              onClick={() => setShowQR(!showQR)}
              type="button"
            >
              {showQR ? 'Tutup QR Scanner' : 'Scan QR Meja'}
            </ButtonFilled>
            {showQR && (
              <div className="mt-4">
                <TableQRScanner onScan={(val) => { setTableNumber(val); setShowQR(false); }} />
              </div>
            )}
            {/* Tampilkan hasil scan jika ada */}
            {tableNumber && (
              <div className="mt-2 text-green-700 font-semibold">Nomor Meja: {tableNumber}</div>
            )}
          </div>
        )}
        {/* Input Alamat jika Delivery */}
        {orderType === 'delivery' && (
          <div className="mb-6">
            <Title3 className="mb-2">Alamat Pengiriman</Title3>
            {addressLoading ? (
              <div className="text-gray-500">Memuat alamat...</div>
            ) : editingAddress ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alamat lengkap"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
                <ButtonFilled
                  className="px-4"
                  onClick={handleSaveAddress}
                >
                  Simpan
                </ButtonFilled>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex-1">{address || <span className="text-gray-400">Belum ada alamat</span>}</span>
                <ButtonFilled className="px-4 py-1" onClick={() => setEditingAddress(true)}>
                  Edit
                </ButtonFilled>
              </div>
            )}
          </div>
        )}
        {/* Pilihan Metode Pembayaran */}
        <div className="mb-6">
          <Title3 className="mb-2">Metode Pembayaran</Title3>
          <div className="flex gap-2 flex-wrap">
            {PAYMENT_METHODS.map((pm) => (
              <button
                key={pm.value}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${paymentMethod === pm.value ? 'bg-blue-600 text-black border-blue-600' : 'bg-white text-gray-700 border-gray-300 border-[1px] border-solid hover:border-blue-400'}`}
                onClick={() => setPaymentMethod(pm.value)}
                type="button"
              >
                {pm.label}
              </button>
            ))}
          </div>
        </div>
        {/* Ringkasan Order */}
        <div className="mb-6">
          <Title3 className="mb-2">Ringkasan Pesanan</Title3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Gambar</th>
                  <th className="p-2 text-left">Produk</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Harga Satuan</th>
                  <th className="p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {mappedItems.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">
                      <img src={item.image} alt={item.productName} className="w-12 h-12 object-cover rounded border" />
                    </td>
                    <td className="p-2">
                      <div className="font-medium text-gray-900">{item.productName}</div>
                      {item.size && <div className="text-xs text-gray-500">{item.size}</div>}
                    </td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">
                      {item.price != null && item.price !== 0
                        ? `Rp ${Number(item.price).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`
                        : '-'}
                    </td>
                    <td className="p-2 text-right font-semibold">
                      {item.price != null && item.price !== 0
                        ? `Rp ${(Number(item.price) * (item.quantity ?? 0)).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
         
          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-blue-600">Rp {totalPayment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-700">Tipe Order</span>
            <span className="font-semibold">{ORDER_TYPE_LABELS[orderType as keyof typeof ORDER_TYPE_LABELS] || orderType}</span>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
        <ButtonFilled
          className="w-full py-3 text-lg"
          onClick={handleConfirm}
          disabled={loading || items.length === 0}
        >
          {loading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
        </ButtonFilled>
      </div>
    </div>
  );
}
