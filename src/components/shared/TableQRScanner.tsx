import { QrReader } from 'react-qr-reader';
import QrDecoder from 'qrcode-decoder';
import React from 'react';

export default function TableQRScanner({ onScan }: { onScan: (value: string) => void }) {
  return (
    <div>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            const value = result.getText ? result.getText() : (result as any).text;
            onScan(value);
          }
        }}
        constraints={{ facingMode: 'environment' }}
      />
      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
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
                onScan(res?.data || 'QR tidak terbaca');
              };
            };
            reader.readAsDataURL(file);
          }}
        />
      </div>
    </div>
  );
}
