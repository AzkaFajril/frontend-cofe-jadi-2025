import React, { useEffect, useState } from 'react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const InPlaceOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('pending');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/inplace', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (orderId: string, status: 'completed' | 'cancelled') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">In-Place Orders</h1>
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium">Filter Status:</label>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-50 to-green-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Table Number</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders
              .filter(order =>
                statusFilter === 'all'
                  ? order.status !== 'completed' && order.status !== 'cancelled'
                  : order.status === statusFilter
              )
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
                  {order.tableNumber || '-'}
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
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>{order.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button
                    className="transition-all duration-200 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-green-300 scale-100 hover:scale-105"
                    onClick={() => handleConfirm(order._id, 'completed')}
                    title="Mark as Completed"
                  >✔</button>
                  <button
                    className="transition-all duration-200 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-red-300 scale-100 hover:scale-105"
                    onClick={() => handleConfirm(order._id, 'cancelled')}
                    title="Cancel Order"
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

export default InPlaceOrders;
