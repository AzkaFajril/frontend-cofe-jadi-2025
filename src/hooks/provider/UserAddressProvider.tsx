import { useCallback, useMemo, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../useLocalStorage';
import { UserAddress } from '@/types';
import UserAddressContext from '../context/UserAddressContext';

const keyName = 'coffee-shop-auth-user-address';
const API_URL = 'http://localhost:5000';

type UserAddressProviderProps = {
  children: JSX.Element | JSX.Element[];
};

const UserAddressProvider = ({ children }: UserAddressProviderProps) => {
  const [address, setAddress] = useLocalStorage<UserAddress>(keyName, null);
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const navigate = useNavigate();

  // Listen to userId changes in localStorage (login/logout/multi-tab)
  useEffect(() => {
    const handleStorage = () => {
      setUserId(localStorage.getItem('userId'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Fetch address setiap kali userId berubah (login/logout/multi-tab)
  useEffect(() => {
    if (userId) {
      fetch(`${API_URL}/api/address/${userId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.fullAddress) {
            setAddress(data);
          } else {
            setAddress(null);
          }
        })
        .catch(() => setAddress(null));
    } else {
      setAddress(null);
    }
  }, [userId]);

  // Update address: auto simpan ke backend & context/localStorage
  const updateAddress = useCallback(
    async (newAddr: UserAddress) => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      // Simpan ke backend
      await fetch(`${API_URL}/api/address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...newAddr }),
      });
      setAddress(newAddr);
    },
    [navigate, setAddress]
  );

  // Hapus address dari context/localStorage
  const removeAddress = useCallback(() => {
    setAddress(null);
  }, [navigate, setAddress]);

  const value = useMemo(
    () => ({
      address,
      updateAddress,
      removeAddress,
    }),
    [address]
  );

  return (
    <UserAddressContext.Provider value={value}>
      {children}
    </UserAddressContext.Provider>
  );
};

export default UserAddressProvider;

export const useUserAddress = () => {
  const context = useContext(UserAddressContext);
  if (!context) {
    throw new Error('useUserAddress must be used within a UserAddressContext');
  }
  return context;
};
