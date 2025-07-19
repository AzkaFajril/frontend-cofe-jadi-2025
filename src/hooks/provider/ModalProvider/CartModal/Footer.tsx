import { useShoppingCart } from '@/hooks/useShoppingCart';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import { priceWithSign } from '@/utils/helper';
import { useNavigate } from 'react-router-dom';
import { useModal } from '@/hooks/useModal';

export default function Footer() {
  // Shopping Cart
  const { totalPayment } = useShoppingCart();
  const navigate = useNavigate();
  const { closeCartModal } = useModal();

  const handleCheckoutClick = () => {
    closeCartModal();
    navigate('/PaymentPage');
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 w-full">
      <div className="flex flex-col text-left sm:text-right sm:items-end flex-1">
        <p className="text-gray-500 text-sm font-normal ">
          Total
        </p>
        <p className="text-gray-800 font-semibold">
          {priceWithSign(totalPayment)}
        </p>
      </div>
      <ButtonFilled 
        className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 sm:py-2 text-base sm:text-sm font-semibold shadow-md sm:ml-4"
        onClick={handleCheckoutClick}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" />
        </svg>
        Checkout
      </ButtonFilled>
    </div>
  );
}
