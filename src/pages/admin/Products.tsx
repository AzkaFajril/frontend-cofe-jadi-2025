import React, { useState, useEffect } from 'react';
import { PhotoIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProductForm from '../../components/admin/ProductForm';
import { formatRupiah } from '../../utils/helper';

interface Product {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  sizes: Array<{ name: string; price: number }>;
  category: string;
  image: string;
  isAvailable: boolean;
  createdAt: string;
}

interface ProductFormData {
  name: string;
  displayName: string;
  description: string;
  sizes: Array<{ name: string; price: number }>;
  category: string;
  image: string;
  isAvailable: boolean;
}

function uniqueById(array: Product[]): Product[] {
  const seen = new Set();
  return array.filter((item) => {
    if (seen.has(item._id)) return false;
    seen.add(item._id);
    return true;
  });
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      const token = localStorage.getItem('token');
      const url = editingProduct 
        ? `http://localhost:5000/admin/products/${editingProduct._id}`
        : 'http://localhost:5000/admin/products';
      
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const newProduct = await response.json();
        setShowAddModal(false);
        setEditingProduct(null);
        setProducts(prev => {
          if (editingProduct) {
            // UPDATE: replace produk lama dengan produk baru
            return prev.map(p => p._id === newProduct._id ? newProduct : p);
          } else {
            // ADD: tambah produk baru ke atas
            return [newProduct, ...prev];
          }
        });
        alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'Failed to save product'));
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/admin/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          fetchProducts();
          alert('Product deleted successfully!');
        } else {
          const error = await response.json();
          alert('Error: ' + (error.message || 'Failed to delete product'));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
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
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <button
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded bg-black"
            onClick={openAddModal}
          >
              + Add New Product
          </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500">
              <PhotoIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500">
              <PhotoIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(product => product.isAvailable).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500">
              <PhotoIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hot Drinks</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(product => product.category === 'hotd-rinks').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500">
              <PhotoIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cold Drinks</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(product => product.category === 'coldDrinks').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-500">
              <PhotoIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Food/Eat</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(product => product.category === 'food' || product.category === 'eat').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-500">
              <PhotoIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Desserts</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(product => product.category === 'desserts' || product.category === 'dessert').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
        <input
          type="text"
          placeholder="Search product name or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 border-solid rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 md:mb-0"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="w-full md:w-1/4 px-3 py-2 border border-gray-300 border-solid rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="hotDrinks">Hot Drinks</option>
          <option value="coldDrinks">Cold Drinks</option>
          <option value="food">Food / Eat</option>
          <option value="desserts">Desserts</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {uniqueById(
          products
          .filter(product =>
              (categoryFilter === 'all' ||
                (categoryFilter === 'food'
                  ? (product.category === 'food' || product.category === 'eat')
                  : product.category === categoryFilter)
              ) &&
            (
              product.displayName.toLowerCase().includes(search.toLowerCase()) ||
              product.name.toLowerCase().includes(search.toLowerCase()) ||
              product.category.toLowerCase().includes(search.toLowerCase())
            )
          )
        ).map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={product.image || '/images/coffee/hot-americano.jpeg'}
                alt={product.displayName}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-900">
                  {formatRupiah(product.sizes[0]?.price || 0)}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.category === 'hotDrinks' ? 'bg-red-100 text-red-800' :
                  product.category === 'coldDrinks' ? 'bg-blue-100 text-blue-800' :
                  product.category === 'food' || product.category === 'eat' ? 'bg-green-100 text-green-800' :
                  product.category === 'desserts' || product.category === 'dessert' ? 'bg-pink-100 text-pink-800' :
                  'bg-gray-100 text-gray-800'
                } capitalize`}>
                  {product.category.replace('-', ' ')}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-black px-3 py-2 rounded text-sm"
                >
                  <PencilIcon className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                >
                  <TrashIcon className="w-4 h-4 inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Form Modal */}
      {showAddModal && (
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          initialData={editingProduct ? {
            name: editingProduct.name,
            displayName: editingProduct.displayName,
            description: editingProduct.description,
            sizes: editingProduct.sizes,
            category: editingProduct.category,
            image: editingProduct.image,
            isAvailable: editingProduct.isAvailable
          } : undefined}
          isEditing={!!editingProduct}
          id={editingProduct?._id} // Kirim id produk ke ProductForm
        />
      )}
    </div>
  );
};

export default Products; 