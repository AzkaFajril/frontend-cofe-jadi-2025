import { useShoppingCart } from '@/hooks/useShoppingCart';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import PriceRow from '@/components/shared/PriceRow';
import StickyModalFooter from '../StickyModalFooter';
import { DeliOption } from '@/types';
import { useUserAddress } from '@/hooks/useUserAddress';
import FullHeightContainer from '../FullHeightContainer';


interface FooterProps {
  onOrderClick: () => void;
  
}
export default function Footer({ onOrderClick }: FooterProps) {
  // Shopping Cart
  const { address } = useUserAddress();
  // Shopping Cart
  const { totalPayment, deliOption } = useShoppingCart();
  const btnDisable = deliOption === DeliOption.DELIVER && !address;

  return (
    <div className="bg-white p-4 border-t">
      <PriceRow lable="Total Payment" amount={totalPayment} />
      <ButtonFilled
        className="w-full mt-2"
        onClick={onOrderClick}
        disabled={btnDisable}
      >
        Order Now
      </ButtonFilled>
    </div>
  );
}
