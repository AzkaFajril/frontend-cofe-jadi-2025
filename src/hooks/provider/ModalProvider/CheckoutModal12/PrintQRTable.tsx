import { QRCodeSVG } from 'qrcode.react';

export default function PrintQRTable() {
  // Ganti dengan daftar nomor meja Anda
  const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Cetak QR Code Nomor Meja</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
        {tableNumbers.map((num) => (
          <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #eee', borderRadius: 8, padding: 16, width: 180 }}>
            <QRCodeSVG value={`Meja ${num}`} size={128} />
            <div style={{ marginTop: 12, fontWeight: 'bold', fontSize: 18 }}>Meja {num}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
