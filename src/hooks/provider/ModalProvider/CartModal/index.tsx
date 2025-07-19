import { useShoppingCart } from '@/hooks/useShoppingCart';
import BaseModal from '@/components/shared/modal/BaseModal';
import DeliOptionSwitch from './DeliOptionSwitch';
import Footer from './Footer';
import PaymentSummary from './PaymentSummary';
import OrderItemList from './OrderItemList';
import EmptyCart from './EmptyCart';
import StickyModalHeader from '../StickyModalHeader';

interface CartModalProps {
  show: boolean;
  onClose: () => void;
}

export default function CartModal({ show, onClose }: CartModalProps) {
  // Shopping Cart
  const { itemCount } = useShoppingCart();

  return (
    <BaseModal show={show} onClose={() => {}} fullScreen>
      <div className="flex flex-col h-full">
        <StickyModalHeader title="Shopping Cart" onClose={onClose} />
        {itemCount > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto px-4 pb-4 -webkit-overflow-scrolling-touch">
              <DeliOptionSwitch />
              <OrderItemList />
              <hr className="my-2" />
              <PaymentSummary />
            </div>
            <Footer />
          </>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 pb-4 -webkit-overflow-scrolling-touch">
            <EmptyCart />
          </div>
        )}
      </div>
    </BaseModal>
  );
}
