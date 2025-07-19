import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../pages/admin/Sidebar';
import Header from '../../pages/admin/Header';
import ProductForm, { ProductFormData } from '../../components/admin/ProductForm';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        // Refresh the dashboard data
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const handleAddProduct = async (formData: ProductFormData) => {
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
        fetchDashboardStats(); // refresh data dashboard
        alert('Product added successfully!');
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'Failed to add product'));
      }
    } catch (error) {
      alert('Failed to add product');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>
      
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
          {showAddModal && (
            <ProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setShowAddModal(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;