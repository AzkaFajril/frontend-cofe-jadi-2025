import axios from 'axios';

// Update address user
export async function updateUserAddress(
  userId: string,
  fullAddress: string,
  coordinates: { lat: number, lng: number }
) {
  const res = await axios.put(`/api/users/${userId}/address`, {
    fullAddress,
    coordinates,
  });
  return res.data;
}

// Ambil data user (termasuk address)
export async function getUserById(userId: string) {
  const res = await axios.get(`/api/users/${userId}`);
  return res.data;
}
