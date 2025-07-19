import React, { useState } from 'react';
import axios from 'axios';

const UploadMenu = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('available', available ? 'true' : 'false');
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Menu berhasil diupload!');
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');
      setAvailable(true);
      setImage(null);
    } catch (err) {
      alert('Gagal upload menu');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Nama Menu" value={name} onChange={e => setName(e.target.value)} required />
      <input type="number" placeholder="Harga" value={price} onChange={e => setPrice(e.target.value)} required />
      <textarea placeholder="Deskripsi" value={description} onChange={e => setDescription(e.target.value)} required />
      <input type="text" placeholder="Kategori" value={category} onChange={e => setCategory(e.target.value)} required />
      <label>
        <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} />
        Tersedia
      </label>
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} required />
      <button type="submit">Upload Menu</button>
    </form>
  );
};

export default UploadMenu;
