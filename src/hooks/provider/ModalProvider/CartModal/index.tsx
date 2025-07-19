import { useShoppingCart } from '@/hooks/useShoppingCart';
import BaseModal from '@/components/shared/modal/BaseModal';
import DeliOptionSwitch from './DeliOptionSwitch';
import Footer from './Footer';
import PaymentSummary from './PaymentSummary';
import OrderItemList from './OrderItemList';
import EmptyCart from './EmptyCart';
import StickyModalHeader from '../StickyModalHeader';
import FullHeightContainer from '../FullHeightContainer';
import FlexContainer from '../FlexContainer';

interface CartModalProps {
  show: boolean;
  onClose: () => void;
}

export default function CartModal({ show, onClose }: CartModalProps) {
  // Shopping Cart
  const { itemCount } = useShoppingCart();

  return (
    <BaseModal show={show} onClose={() => {}} fullScreen>
      <FlexContainer>
        <StickyModalHeader title="Shopping Cart" onClose={onClose} />
        {itemCount > 0 ? (
          <>
            {/* Konten scrollable */}
            <FullHeightContainer>
              <div className="bg-white px-2 sm:px-6">
                <OrderItemList />
              </div>
              <hr className="my-2 border-gray-200 border-[1px] border-solid" />
              <div className="bg-white px-2 sm:px-6 pb-2">
                <PaymentSummary />
              </div>
            </FullHeightContainer>
            {/* Footer sticky di bawah, tidak ikut scroll */}
            <div className="bg-white border-t shadow-lg px-4 sm:px-8 py-3 sticky bottom-0 z-10">
              <Footer />
            </div>
          </>
        ) : (
          <EmptyCart />
        )}
      </FlexContainer>
    </BaseModal>
  );
}
