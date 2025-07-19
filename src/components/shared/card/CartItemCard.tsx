import React from 'react';
import CounterInputSm from '@/components/shared/CounterInputSm';
import { CartItem } from '@/types';
import { priceWithSign, formatRupiahTanpaDesimal } from '@/utils/helper';
import { useShoppingCart } from '@/hooks/useShoppingCart';

interface CartItemCardProps {
  cartItem: CartItem;
  index: number;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ cartItem, index }) => {
  // Shopping Cart
  const { updateQuantity, removeFromCart } = useShoppingCart();
  // Local Variable
  const { product, quantity, size } = cartItem;
  // Cari harga sesuai size jika ada
  const productWithSizes = product as any;
  const sizes = productWithSizes.sizes as { name: string; price: number }[] | undefined;
  let price = product.price;
  if (sizes && sizes.length > 0 && size) {
    const sizeObj = sizes.find(s => s.name?.toLowerCase() === size?.toLowerCase());
    if (sizeObj) price = sizeObj.price;
  }
  const totalAmount = price * quantity;

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      updateQuantity(index, value);
    } else {
      removeFromCart(index);
    }
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <img
          src={product.image}
          className="w-16 h-16 bg-gray-100 object-cover rounded-lg"
          alt={product.displayName}
        />
        <div className="flex flex-col justify-between">
          <div className="flex flex-col">
            <p className="text-primary-700 font-semibold ">
              {product.displayName}
            </p>
            <p className="text-xs text-gray-500 font-medium">
              {size ? `Ukuran: ${size.charAt(0).toUpperCase() + size.slice(1)}` : ''}
            </p>
          </div>
          <CounterInputSm value={quantity} onChange={handleQuantityChange} />
        </div>
      </div>
      <div className="text-right">
        <p className="text-primary font-semibold">
          {formatRupiahTanpaDesimal(totalAmount)}
        </p>
        {quantity > 1 && (
          <span className="text-gray-400 text-xs">{`${formatRupiahTanpaDesimal(price)} each`}</span>
        )}
      </div>
    </div>
  );
};

export default CartItemCard;
