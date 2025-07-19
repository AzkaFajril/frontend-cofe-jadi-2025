import { useState } from 'react';
import { CoffeeProduct } from '@/types';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import CounterInput from '@/components/shared/CounterInput';
import { useShoppingCart } from '@/hooks/useShoppingCart';

interface ProductDetailModalFooterProps {
  product: CoffeeProduct;
  onClose: () => void;
  selectedSize: string;
}

export default function Footer({ product, onClose, selectedSize }: ProductDetailModalFooterProps) {
  // Shopping Cart
  const { addToCart } = useShoppingCart();
  // Local State
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handelAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    onClose();
  };

  return (
    <div className="flex items-center justify-between w-full bg-white border-t p-4">
      <CounterInput value={quantity} onChange={handleQuantityChange} />
      <ButtonFilled onClick={handelAddToCart}>Add to Cart</ButtonFilled>
    </div>
  );
}
