import React, { useEffect, useState } from 'react';

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
  const [statusFilter, setStatusFilter] = useState<'all' | 'processing' | 'completed' | 'cancelled'>('processing');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'online' | 'cod'>('all');

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Delivery Orders</h1>
      <div className="mb-6 p-4 rounded-lg border border-yellow-400 border-solid bg-yellow-50 flex flex-col gap-1 shadow-sm max-w-xl">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">!</span>
          <span className="font-semibold text-yellow-900">Pending:</span>
          <span className="ml-2 text-yellow-900">Belum payment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">!</span>
          <span className="font-semibold text-yellow-900">Processing:</span>
          <span className="ml-2 text-yellow-900">Sudah payment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">!</span>
          <span className="font-semibold text-yellow-900">Completed:</span>
          <span className="ml-2 text-yellow-900">Makanan / Minuman sudah di antar / di kirim</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">!</span>
          <span className="font-semibold text-yellow-900">Cancelled:</span>
          <span className="ml-2 text-yellow-900">Order dibatalkan</span>
        </div>
      </div>
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
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-50 to-green-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders
              .filter(order =>
                (order.deliveryType || order.orderType || order.deliOption || '').toLowerCase() === 'delivery'
              )
              .filter(order =>
                statusFilter === 'all' ? true : order.status === statusFilter
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
              .map((order, idx) => (
              <tr
                key={order._id}
                className="transition-all duration-300 ease-in-out hover:bg-blue-50 animate-fadeIn"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  #{order.orderId || order._id?.slice(-6)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {/* Customer Name */}
                  {order.customer?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {/* Customer Phone */}
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
                      <span className="absolute left-1/2 -translate-x-1/2 mt-2 z-10 hidden group-hover:block group-focus:block bg-black text-white text-xs rounded px-3 py-2 whitespace-nowrap shadow-lg border border-gray-700 border-solid font-medium" style={{ minWidth: '180px' }}>
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
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button
                    className="transition-all duration-200 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-green-300 scale-100 hover:scale-105"
                    onClick={() => handleConfirm(order, 'next')}
                    title="Mark as Completed"
                  >✔</button>
                  <button
                    className="transition-all duration-200 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-red-300 scale-100 hover:scale-105"
                    onClick={() => handleConfirm(order, 'back')}
                    title="Cancel/Back Order"
                  >✖</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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