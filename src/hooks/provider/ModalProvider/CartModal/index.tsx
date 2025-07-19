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
      <div className="flex flex-col h-full bg-white">
        <div className="flex-shrink-0 bg-white/75 backdrop-blur-sm px-2 py-3 border-b relative">
          <h2 className="text-center text-lg font-semibold text-neutral-800">
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="block sm:hidden absolute top-3.5 left-3 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="hidden sm:block absolute top-3.5 right-3 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {itemCount > 0 ? (
          <>
            <div 
              className="flex-1 overflow-y-auto px-4 pb-4 -webkit-overflow-scrolling-touch"
              style={{ 
                height: 'calc(100vh - 120px)', 
                minHeight: '200px',
                maxHeight: 'calc(100vh - 120px)'
              }}
            >
              <DeliOptionSwitch />
              <OrderItemList />
              <hr className="my-2" />
              <PaymentSummary />
            </div>
            <div className="flex-shrink-0 bg-white/75 backdrop-blur-sm border-t p-3">
              <Footer />
            </div>
          </>
        ) : (
          <div 
            className="flex-1 overflow-y-auto px-4 pb-4 -webkit-overflow-scrolling-touch"
            style={{ 
              height: 'calc(100vh - 120px)', 
              minHeight: '200px',
              maxHeight: 'calc(100vh - 120px)'
            }}
          >
            <EmptyCart />
          </div>
        )}
      </div>
    </BaseModal>
  );
}
