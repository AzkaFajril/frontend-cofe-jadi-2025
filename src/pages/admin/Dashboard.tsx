import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import ProductForm from '../../components/admin/ProductForm';
import { formatRupiah } from '../../utils/helper';

interface DashboardStats {
  totalUsers: number;
  totalPayments: number;
  totalRevenue: number;
  recentOrders: Array<{
    _id: string;
    userId: {
      name: string;
      email: string;
    };
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPayments: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowAddModal(false);
        fetchDashboardStats();
        alert('Product added successfully!');
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'Failed to add product'));
      }
    } catch (error) {
      alert('Failed to add product');
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' && title.includes('Revenue') 
              ? `$${(value || 0).toFixed(2)}` 
              : (value || 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your coffee shop admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={UsersIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalPayments}
          icon={ShoppingBagIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Total Revenue"
          value={formatRupiah(stats.totalRevenue)}
          icon={CurrencyDollarIcon}
          color="bg-yellow-500"
        />
        <StatCard
          title="Growth Rate"
          value="12.5%"
          icon={ArrowTrendingUpIcon}
          color="bg-purple-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order, index) => (
                <div key={order._id || `order-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Order #{order._id?.slice(-6) || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">
                      {(order.items?.length || 0)} items - ${(order.totalAmount || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{order.userId?.name || 'Unknown User'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded transition-colors" onClick={() => setShowAddModal(true)}>
              <p className="font-medium text-blue-900">Add New Product</p>
              <p className="text-sm text-blue-700">Create a new menu item</p>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded transition-colors">
              <p className="font-medium text-green-900">View Reports</p>
              <p className="text-sm text-green-700">Check sales analytics</p>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded transition-colors">
              <p className="font-medium text-purple-900">Manage Users</p>
              <p className="text-sm text-purple-700">View and edit user accounts</p>
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;