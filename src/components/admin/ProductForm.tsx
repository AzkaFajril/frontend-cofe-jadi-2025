import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { formatRupiah } from '../../utils/helper';
import axios from 'axios';
import { createProduct } from '../../service/product';

export interface ProductFormData {
  name: string;
  displayName: string;
  description: string;
  sizes: Array<{ name: string; price: number }>;
  category: string;
  image: string;
  isAvailable: boolean;
}

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  initialData?: ProductFormData;
  isEditing?: boolean;
  id?: string; // Tambahkan id untuk edit
}

const categories = [
  { value: 'hotDrinks', label: 'Hot Drinks' },
  { value: 'coldDrinks', label: 'Cold Drinks' },
  { value: 'food', label: 'food / eat' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'drink', label: 'Drink' },
];

const defaultSizes = [
  { name: 'Small', price: 0 },
  { name: 'Medium', price: 0 },
  { name: 'Large', price: 0 },
];

// Fungsi untuk submit produk baru
const submitProduct = async (productData: any) => {
  try {
    // Ambil token dari localStorage (atau dari context/auth state)
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Anda harus login sebagai admin!');
      return;
    }

    // Lakukan POST ke endpoint admin/products
    const response = await axios.post(
      'http://localhost:5000/admin/products',
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Jika sukses
    alert('Produk berhasil ditambahkan!');
    return response.data;
  } catch (error: any) {
    // Tangani error
    if (error.response && error.response.data && error.response.data.message) {
      alert('Gagal menambah produk: ' + error.response.data.message);
    } else {
      alert('Gagal menambah produk: ' + error.message);
    }
  }
};

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel, initialData, isEditing, id }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    displayName: '',
    description: '',
    sizes: defaultSizes,
    category: 'hotDrinks',
    image: '',
    isAvailable: true,
    ...initialData
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSizeChange = (index: number, field: 'name' | 'price', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => 
        i === index ? { ...size, [field]: field === 'price' ? parseFloat(value as string) : value } : size
      )
    }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { name: '', price: 0 }]
    }));
  };

  const removeSize = (index: number) => {
    if (formData.sizes.length > 1) {
      setFormData(prev => ({
        ...prev,
        sizes: prev.sizes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.displayName.trim()) newErrors.displayName = 'Display name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    // Validate sizes
    if (!formData.sizes || formData.sizes.length === 0) {
      newErrors.sizes = 'At least one size is required';
    } else {
      formData.sizes.forEach((size, index) => {
        if (!size.name.trim()) {
          newErrors[`size_${index}_name`] = 'Size name is required';
        }
        if (size.price <= 0) {
          newErrors[`size_${index}_price`] = 'Price must be greater than 0';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Anda harus login!');
        return;
      }
      try {
        let response;
        if (isEditing && id) {
          // EDIT: PUT ke endpoint update
          response = await axios.put(
            `http://localhost:5000/admin/products/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        } else {
          // ADD: POST ke endpoint tambah
          response = await axios.post(
            'http://localhost:5000/admin/products',
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        }
        alert(isEditing ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!');
        onSubmit(response.data); // Kirim produk baru/terupdate ke parent agar state langsung update
      } catch (err: any) {
        alert('Gagal menyimpan produk: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.displayName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., Hot Americano"
              />
              {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name (Internal)</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., hot-americano"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Product description..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          
          {/* Sizes Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Sizes & Prices</label>
              {/* Removed Add Size and Remove Size buttons */}
            </div>
            {errors.sizes && <p className="text-red-500 text-xs mb-2">{errors.sizes}</p>}
            {formData.sizes.map((size, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={size.name}
                  onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                  placeholder="Size name (e.g., Small)"
                  className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`size_${index}_name`] ? 'border-red-500' : 'border-gray-300'}`}
                  readOnly={['Small', 'Medium', 'Large'].includes(size.name)}
                />
                <input
                  type="number"
                  value={size.price}
                  onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="Price"
                  className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`size_${index}_price`] ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div className="flex items-center gap-2">
                  {size.price > 0 && (
                    <span className="text-xs text-gray-500">{formatRupiah(size.price)}</span>
                  )}
                  {formData.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {errors[`size_${index}_name`] && <p className="text-red-500 text-xs">{errors[`size_${index}_name`]}</p>}
                {errors[`size_${index}_price`] && <p className="text-red-500 text-xs">{errors[`size_${index}_price`]}</p>}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          
          <ImageUpload onImageUpload={handleImageUpload} currentImage={formData.image} />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Available for purchase</label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-black py-3 px-4 rounded-md font-medium transition-colors"
            >
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 