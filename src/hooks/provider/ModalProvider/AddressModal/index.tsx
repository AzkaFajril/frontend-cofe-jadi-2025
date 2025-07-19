import { useState, useEffect } from 'react';
import { useUserAddress } from '@/hooks/provider/UserAddressProvider'; // pastikan import dari provider baru
import BaseModal from '@/components/shared/modal/BaseModal';
import StickyModalHeader from '../StickyModalHeader';
import FlexContainer from '../FlexContainer';
import FullHeightContainer from '../FullHeightContainer';
import ControlButtons from './ControlButtons';
import InputBox from './InputBox';

interface AddressModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AddressModal({ show, onClose }: AddressModalProps) {
  const { address: userAddress, updateAddress } = useUserAddress();

  // State input alamat, sync dengan context
  const [address, setAddress] = useState(userAddress?.fullAddress || '');
  const [coordinates, setCoordinates] = useState(userAddress?.coordinates || { lat: 0, lng: 0 });

  // Sync input jika address dari context berubah (misal setelah login)
  useEffect(() => {
    setAddress(userAddress?.fullAddress || '');
    setCoordinates(userAddress?.coordinates || { lat: 0, lng: 0 });
  }, [userAddress]);

  const confirmBtnDisabled = !address || address.length > 255;

  const handleConfirm = async () => {
    if (!address) return;
    await updateAddress({ fullAddress: address, coordinates }); // Simpan ke context
    onClose();
  };

  return (
    <BaseModal show={show} onClose={onClose} fullScreen>
      <FlexContainer>
        <StickyModalHeader title="Change Address" onClose={onClose} />
        <FullHeightContainer>
          <InputBox
            value={address}
            onChange={setAddress}
            isLoading={false}
          />
          {/* MAPS DIMATIKAN */}
          <ControlButtons
            onCancelClick={onClose}
            onConfirmClick={handleConfirm}
            confirmBtnDisabled={confirmBtnDisabled}
          />
        </FullHeightContainer>
      </FlexContainer>
    </BaseModal>
  );
}
