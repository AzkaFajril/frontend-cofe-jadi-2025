import { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import QrDecoder from 'qrcode-decoder';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import { v4 as uuidv4 } from 'uuid';

interface ScanTableQRProps {
  tableNumber: string;
  setTableNumber: (val: string) => void;
}

export default function ScanTableQR({ tableNumber, setTableNumber }: ScanTableQRProps) {
  const { items, totalPayment, paymentMethod, clearCart } = useShoppingCart();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = document.querySelector('video');
      if (video) {
        video.style.transform = 'scaleX(1)';
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Handler untuk upload file gambar QR
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageDataUrl = event.target?.result as string;
      const img = new window.Image();
      img.src = imageDataUrl;
      img.onload = async () => {
        const qr = new QrDecoder();
        const res = await qr.decodeFromImage(img);
        setTableNumber(res?.data || 'QR tidak terbaca');
      };
    };
    reader.readAsDataURL(file);
  };

  // Fungsi submit order in-place
  const handleOrderInPlace = async () => {
    if (!tableNumber) return alert('Nomor meja wajib diisi!');
    if (!items || items.length === 0) return alert('Keranjang kosong!');
    setLoading(true);
    const orderData = {
      id: uuidv4(),
      tableNumber,
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.displayName,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalPayment,
      paymentMethod,
      orderType: 'IN_PLACE',
      deliOption: 'in-place',
      date: new Date().toLocaleString('en-US'),
      image: items[0]?.product?.image || '',
    };
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        alert('Order berhasil disimpan!');
        setTableNumber('');
        clearCart();
      } else {
        alert('Gagal menyimpan order!');
      }
    } catch (err) {
      alert('Gagal menyimpan order!');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-2">Scan QR Nomor Meja</h2>
      <p className="mb-2 text-gray-600 text-sm">
        Arahkan kamera ke QR code yang ada di meja Anda atau masukkan nomor meja secara manual.
      </p>
      <div style={{ width: '100%' }}>
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              const value = result.getText ? result.getText() : (result as any).text;
              setTableNumber(value);
            }
          }}
          constraints={{ facingMode: 'environment' }}
        />
      </div>
      <div className="mt-4">
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <p className="mt-2 text-gray-500 text-xs">
        Jika kamera tidak aktif, pastikan izin kamera sudah diberikan dan gunakan browser terbaru.
      </p>
      <div className="mt-4 text-lg font-bold">
        {tableNumber && <>Nomor Meja: {tableNumber}</>}
      </div>
    </div>
  );
}
