import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '@/components/shared/dialog/ConfirmDialog';
import BaseModal from '@/components/shared/modal/BaseModal';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { Customer, DeliOption, OrderItem } from '@/types';
import PageLoading from '@/components/shared/PageLoading';
import SelfPickup from './SelfPickup';
import Footer from './Footer';
import DeliveryAddress from './DeliveryAddress';
import PaymentMethodSwitch from './PaymentMethodSwitch';
import OrderSummary from './OrderSummary';
import StickyModalHeader from '../StickyModalHeader';
import FlexContainer from '../FlexContainer';
import FullHeightContainer from '../FullHeightContainer';
import { fakeTimer } from '@/utils/helper';
import { useModal } from '@/hooks/useModal';
import { TAddOrder, addOrder } from '@/service/order';
import { useAuth } from '@/hooks/useAuth';
import { useUserAddress } from '@/hooks/useUserAddress';
import Inplace from './inplace';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

interface CheckoutModalProps {
  show: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ show, onClose }: CheckoutModalProps) {
  // Navigator
  const navigate = useNavigate();
  // Auth Prodiver
  const { user } = useAuth();
  // Address Prodiver
  const { address } = useUserAddress();
  // Shopping Cart Provider
  const {
    items: cartItems,
    deliOption,
    totalPayment,
    paymentMethod,
    clearCart,
  } = useShoppingCart();
  // Modal Provider
  const { closeCartModal, showOrderStatusModal, showAddressModal } = useModal();
  // Local State
  const [loading, setLoading] = useState(false);
  const [showLoginCD, setShowLoginCD] = useState(false);
  const [showAddrCD, setShowAddrCD] = useState(false);
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    if (show) {
      setTableNumber('');
    }
  }, [show]);

  const getOrderData = (): TAddOrder & { tableNumber?: string } => {
    let customer: Customer | undefined = undefined;
    if (deliOption !== DeliOption.IN_PLACE && deliOption !== DeliOption.PICK_UP) {
      customer = {
        id: user!.id,
        name: user!.name,
        address: address ? address.fullAddress : '',
        coordinates: address ? address.coordinates : { lat: 0, lng: 0 },
      };
    }
    const orderItems: OrderItem[] = cartItems?.map((ci) => {
      let price = ci.product.price;
      // Jika produk punya variasi size, ambil harga sesuai size
      if (ci.product.sizes && ci.size) {
        const sizeObj = ci.product.sizes.find(s => s.name?.toLowerCase() === ci.size?.toLowerCase());
        if (sizeObj) price = sizeObj.price;
      }
      return {
        productId: ci.product.id,
        productName: ci.product.displayName,
        quantity: ci.quantity,
        price, // <-- harga satuan sesuai size
        size: ci.size,
      };
    });
    const baseOrder = {
      ...(customer ? { customer } : {}),
      items: orderItems,
      deliOption,
      paymentMethod,
      totalPayment: totalPayment,
    };
    if (deliOption === DeliOption.IN_PLACE) {
      return { ...baseOrder, tableNumber };
    }
    return baseOrder;
  };

  const showGoLoginDialog = () => {
    setShowLoginCD(true);
  };

  const handleGoToLogin = () => {
    setShowLoginCD(false);
    onClose();
    closeCartModal();
    navigate('/login');
  };

  const makeOrder = async () => {
    setLoading(true);
    await fakeTimer(2000);
    const newOrder = getOrderData();
    const orderData = {
      ...newOrder, // pastikan newOrder sudah berisi items, paymentMethod, totalPayment
      userId: localStorage.getItem('userId'),
      date: new Date().toLocaleString('en-US'),
      image: cartItems[0]?.product?.image || '',
      orderType: deliOption === DeliOption.IN_PLACE ? 'IN_PLACE' : deliOption === DeliOption.PICK_UP ? 'PICK_UP' : 'DELIVER',
    };
    // HAPUS field id jika ada!
    delete orderData.id;
    try {
      console.log("Order data:", orderData);
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const order = await res.json();
      addOrder(newOrder); // Simpan ke localStorage untuk history
      setLoading(false);
      //clearCart();
      onClose();
      closeCartModal();
      showOrderStatusModal(order);
    } catch (err) {
      console.error('Order error:', err);
      setLoading(false);
      alert('Gagal membuat order!');
    }
  };

  const handleOrderClick = () => {
    if (!user) {
      showGoLoginDialog();
      return;
    }
    if (deliOption === DeliOption.DELIVER && !address) {
      setShowAddrCD(true);
      return;
    }
    makeOrder();
  };

  const handleAddAddress = () => {
    if (deliOption === DeliOption.IN_PLACE) return; // Tidak melakukan apa-apa untuk in-place
    setShowAddrCD(false);
    showAddressModal();
  };

  return (
    <>
      <BaseModal show={show} onClose={() => {}} fullScreen>
        <FlexContainer>
          <StickyModalHeader title="Checkout Order" onClose={onClose} />
          <FullHeightContainer>
            {deliOption === DeliOption.DELIVER ? (
              <DeliveryAddress />
            ) : deliOption === DeliOption.IN_PLACE ? (
              <Inplace tableNumber={tableNumber} setTableNumber={setTableNumber} />
            ) : (
              <SelfPickup />
            )}
            <hr className="my-4" />
            <PaymentMethodSwitch />
            <hr className="my-4" />
            <OrderSummary />
          </FullHeightContainer>
          <Footer onOrderClick={handleOrderClick} />
        </FlexContainer>
        <PageLoading show={loading} />
      </BaseModal>
      <ConfirmDialog
        show={showLoginCD}
        title="Account Required"
        leftBtnClick={() => setShowLoginCD(false)}
        rightBtnClick={handleGoToLogin}
      >
        To proceed with this action, please log in to your account.
      </ConfirmDialog>
      {/* Hapus ConfirmDialog address required untuk IN_PLACE */}
      {deliOption !== DeliOption.IN_PLACE && (
        <ConfirmDialog
          show={showAddrCD}
          title="Address Required"
          leftBtnClick={() => setShowAddrCD(false)}
          rightBtnClick={handleAddAddress}
        >
          To proceed with this action, please add your address to deliver orders.
        </ConfirmDialog>
      )}
    </>
  );
}
