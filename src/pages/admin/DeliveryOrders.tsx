import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentLabels: Record<string, string> = {
  dana: 'OnlinePayment',
  gopay: 'OnlinePayment',
  shopeepay: 'OnlinePayment',
  credit_card: 'OnlinePayment',
  bank_transfer: 'OnlinePayment',
  midtrans: 'OnlinePayment',
  cod: 'COD',
};

const statusTips: Record<string, string> = {
  pending: 'Belum payment',
  processing: 'Sudah payment',
  completed: 'Makanan / Minuman sudah di antar / di kirim',
  cancelled: 'Order dibatalkan',
};

const DeliveryOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'processing' | 'completed' | 'cancelled'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'online' | 'cod'>('all');
  const [searchOrderId, setSearchOrderId] = useState('');

  // State untuk modal edit statusPesanan
  const [showEditPesananModal, setShowEditPesananModal] = useState(false);
  const [editingOrderPesanan, setEditingOrderPesanan] = useState<any>(null);
  const [newPesananStatus, setNewPesananStatus] = useState('belum_dikirim');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://serverc.up.railway.app/api/orders', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data); // Data sudah delivery dari backend
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (order: any, action: 'next' | 'back') => {
    let newStatus = order.status;
    if (order.paymentMethod === 'cod') {
      if (action === 'next') {
        if (order.status === 'pending') newStatus = 'processing';
        else if (order.status === 'processing') newStatus = 'completed';
      } else if (action === 'back') {
        if (order.status === 'completed') newStatus = 'processing';
        else if (order.status === 'processing') newStatus = 'pending';
        else if (order.status === 'pending') newStatus = 'cancelled';
      }
    } else {
      newStatus = action === 'next' ? 'completed' : 'cancelled';
    }
    const fetchOrders = async () => {
      try {
        // Ganti base URL sesuai kebutuhan (bisa pakai proxy di vite.config.js)
        const response = await fetch('https://serverc.up.railway.app/api/orders', {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          // Filter hanya order delivery
          setOrders(data.filter((order: any) =>
            (order.deliveryType || order.orderType || order.deliOption || '').toLowerCase() === 'delivery'
          ));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://serverc.up.railway.app/admin/orders/${order._id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchOrders();
      } else {
        const errMsg = await response.text();
        alert('Failed to update order status: ' + errMsg);
        console.error('Update status error:', errMsg);
      }
    } catch (error) {
      alert('Failed to update order status');
      console.error('Update status error:', error);
    }
  };

  // Fungsi untuk update status pengiriman (statusPesanan) saja, tanpa mengubah status payment
  async function handleStatusPesanan(order: any, newStatusPesanan: string) {
    try {
      const token = localStorage.getItem('token');
      const body: any = { statusPesanan: newStatusPesanan };
      const response = await fetch(`https://serverc.up.railway.app/api/orders/${order.orderId || order._id}/control-statuspesanan`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        fetchOrders();
        setShowEditPesananModal(false);
        setEditingOrderPesanan(null);
      } else {
        const errMsg = await response.text();
        alert('Gagal update status pengiriman: ' + errMsg);
      }
    } catch (error) {
      alert('Gagal update status pengiriman');
    }
  }

  // Fungsi untuk menampilkan modal edit statusPesanan
  const handleEditPesananClick = (order: any) => {
    setEditingOrderPesanan(order);
    setNewPesananStatus(order.statusPesanan || 'belum_dikirim');
    setShowEditPesananModal(true);
  };

  // Fungsi untuk menyimpan perubahan statusPesanan
  const handleSavePesananEdit = async () => {
    if (!editingOrderPesanan) return;
    await handleStatusPesanan(editingOrderPesanan, newPesananStatus);
  };

  // Fungsi untuk menutup modal
  const handleClosePesananModal = () => {
    setShowEditPesananModal(false);
    setEditingOrderPesanan(null);
    setNewPesananStatus('belum_dikirim');
  };

  // Fungsi download Excel
  const handleDownloadExcel = () => {
    const filteredOrders = orders
      .filter(order => statusFilter === 'all' ? true : order.status === statusFilter)
      .filter(order => {
        if (paymentFilter === 'all') return true;
        if (paymentFilter === 'online') {
          return ['dana','gopay','shopeepay','credit_card','bank_transfer','midtrans'].includes((order.paymentMethod || '').toLowerCase());
        }
        if (paymentFilter === 'cod') {
          return (order.paymentMethod || '').toLowerCase() === 'cod';
        }
        return true;
      });
    const data = filteredOrders.map(order => ({
      'Order ID': order.orderId || order._id,
      'Nama': order.customerName || '-',
      'Alamat': order.address || '-',
      'Items': order.items?.map(i => `${i.productName || i.name} x${i.quantity}`).join(', '),
      'Total': order.totalPayment || order.totalAmount,
      'Status': order.status,
      'Payment': order.paymentMethod,
      'Status Pengiriman': order.statusPesanan,
      'Tanggal': order.date ? new Date(order.date).toLocaleString() : '-'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'delivery-orders.xlsx');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-green-600 text-black rounded shadow hover:bg-green-700"
          onClick={handleDownloadExcel}
        >
          Download Excel
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Delivery Orders</h1>
      
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="font-medium">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="border px-2 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium">Filter Payment:</label>
          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value as any)}
            className="border px-2 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="online">OnlinePayment</option>
            <option value="cod">COD</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium">Cari Order ID:</label>
          <input
            type="text"
            placeholder="12345"
            value={searchOrderId}
            onChange={e => setSearchOrderId(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap text-center border-b border-blue-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Order ID
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap text-center border-b border-blue-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Customer
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap text-center border-b border-blue-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Phone
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap text-center border-b border-blue-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Address
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap text-center border-b border-blue-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Items
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap text-center border-b border-blue-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 0C7.582 4 4 7.582 4 12s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" />
                  </svg>
                  Total
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap text-center border-b border-blue-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap text-center border-b border-blue-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap text-center border-b border-blue-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status Pengiriman
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap text-center border-b border-blue-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Edit Status Payemnt
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap text-center border-b border-blue-500">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Edit Status Payemnt
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders
              .filter(order =>
                (order.deliveryType || order.orderType || order.deliOption || '').toLowerCase() === 'delivery'
              )
              .filter(order =>
                statusFilter === 'all'
                  ? order.status !== 'pending'
                  : order.status === statusFilter
              )
              .filter(order => {
                if (paymentFilter === 'all') return true;
                if (paymentFilter === 'online') {
                  return ['dana','gopay','shopeepay','credit_card','bank_transfer','midtrans'].includes((order.paymentMethod || '').toLowerCase());
                }
                if (paymentFilter === 'cod') {
                  return (order.paymentMethod || '').toLowerCase() === 'cod';
                }
                return true;
              })
              .filter(order =>
                searchOrderId === '' ||
                (order.orderId || order._id || '').toLowerCase().includes(searchOrderId.toLowerCase())
              )
              .map((order, idx) => (
              <tr
                key={order._id}
                className="transition-all duration-300 ease-in-out hover:bg-blue-50 animate-fadeIn"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {order.orderId || order._id?.slice(-6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {order.customer?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {order.customer?.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {order.address || order.customer?.address || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <ul className="space-y-1">
                    {order.items?.map((item: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-1">
                        <span className="font-medium">{item.productName || item.name}</span>
                        {item.size && <span className="text-xs text-gray-400">({item.size})</span>}
                        <span className="text-xs text-gray-500">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                  {order.totalPayment || order.totalAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}> {
                    ['dana','gopay','shopeepay','credit_card','bank_transfer','midtrans'].includes((order.paymentMethod || '').toLowerCase())
                      ? (order.status === 'pending' ? 'processing' : order.status === 'completed' ? 'completed' : order.status)
                      : order.status
                  }
                    <span
                      className="ml-2 inline-block align-middle cursor-pointer relative group"
                      tabIndex={0}
                    >
                      <span className="w-4 h-4 bg-yellow-400 text-black rounded-full flex items-center justify-center text-xs font-bold">!</span>
                      <span className="absolute left-1/2 -translate-x-1/2 mt-2 z-10 hidden group-hover:block group-focus:block bg-black text-black text-xs rounded px-3 py-2 whitespace-nowrap shadow-lg border border-gray-700 border-solid font-medium" style={{ minWidth: '180px' }}>
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-yellow-400 text-black font-bold rounded-full flex items-center justify-center text-xs font-bold">!</span>
                          <span>{statusTips[order.status] || '-'}</span>
                        </span>
                      </span>
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-700">
                  {paymentLabels[(order.paymentMethod || '').toLowerCase()] || (order.paymentMethod?.toUpperCase() || '-')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`
                      inline-flex items-center px-4 py-1 rounded-full text-xs font-bold
                      shadow ring-1 ring-gray-200 bg-white
                      transition-all duration-150
                      ${order.statusPesanan === 'sudah_dikirim'
                        ? 'text-green-700'
                        : order.statusPesanan === 'sedang_diproses'
                        ? 'text-yellow-700'
                        : order.statusPesanan === 'dibatalkan'
                        ? 'text-gray-500'
                        : 'text-red-700'
                      }
                      hover:shadow-lg hover:-translate-y-0.5
                    `}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`
                      w-2 h-2 rounded-full mr-2
                      ${order.statusPesanan === 'sudah_dikirim'
                        ? 'bg-green-400'
                        : order.statusPesanan === 'sedang_diproses'
                        ? 'bg-yellow-400'
                        : order.statusPesanan === 'dibatalkan'
                        ? 'bg-gray-400'
                        : 'bg-red-400'
                      }
                    `}></span>
                    {order.statusPesanan === 'sudah_dikirim'
                      ? 'Sudah Dikirim'
                      : order.statusPesanan === 'sedang_diproses'
                      ? 'Sedang Diproses'
                      : order.statusPesanan === 'dibatalkan'
                      ? 'Dibatalkan'
                      : 'Belum Dikirim'
                    }
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    className="bg-white border border-yellow-400 border-solid shadow-md hover:bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold transition-all duration-150"
                    onClick={() => handleEditPesananClick(order)}
                  >Edit Status Pesanan</button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2 justify-center">
                  <button
                    className="transition-all duration-200 bg-green-500 hover:bg-green-600 text-black px-3 py-1 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-green-300 scale-100 hover:scale-105"
                    onClick={() => handleConfirm(order, 'next')}
                    title="Mark as Completed"
                  >✔</button>
                  <button
                    className="transition-all duration-200 bg-red-500 hover:bg-red-600 text-black px-3 py-1 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-red-300 scale-100 hover:scale-105"
                    onClick={() => handleConfirm(order, 'back')}
                    title="Cancel/Back Order"
                  >✖</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     
      {/* Modal Edit Status Pesanan */}
      {showEditPesananModal && editingOrderPesanan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h2 className="text-lg font-bold mb-4">Edit Status Pengiriman</h2>
            <select
              className="w-full border rounded px-2 py-1 mb-4"
              value={newPesananStatus}
              onChange={e => setNewPesananStatus(e.target.value)}
            >
              <option value="belum_dikirim">Belum Dikirim</option>
              <option value="sedang_diproses">Sedang Diproses</option>
              <option value="sudah_dikirim">Sudah Dikirim</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={handleClosePesananModal}
              >Batal</button>
              <button
                className="px-3 py-1 rounded bg-blue-600 text-black hover:bg-blue-700"
                onClick={handleSavePesananEdit}
              >Simpan</button>
            </div>
          </div>
        </div>
      )}
     
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s both;
        }
      `}</style>
    </div>
  );
};

export default DeliveryOrders; 