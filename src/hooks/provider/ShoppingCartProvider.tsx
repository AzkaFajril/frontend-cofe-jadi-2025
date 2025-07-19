import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { CartItem, CoffeeProduct, DeliOption, PaymentMethod } from '@/types';
import ShoppingCartContext from '../context/ShoppingCartContext';
import { getSumFromArr } from '@/utils/helper';
import { defaultDeliFee } from '@/constants/constants';

interface ShoppingCartProviderProps {
  children: ReactNode;
}

const ShoppingCartProvider: React.FC<ShoppingCartProviderProps> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliOption, setDeliOption] = useState(DeliOption.IN_PLACE);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CASH);

  const cartItemIds = items?.map((ci) => ci.product.id);
  const itemCount = items.length;
  
  const subTotal = getSumFromArr(
    items?.map((item) => {
      const productWithSizes = item.product as any;
      const sizes = productWithSizes.sizes as { name: string; price: number }[] | undefined;
      let price = item.product.price;
      if (sizes && sizes.length > 0 && item.size) {
        const sizeObj = sizes.find(s => s.name?.toLowerCase() === item.size?.toLowerCase());
        if (sizeObj) price = sizeObj.price;
      }
      return price * item.quantity;
    })
  );
  const deliFee = deliOption === DeliOption.DELIVER ? defaultDeliFee : 0;
  const totalPayment = subTotal + deliFee;

  const addToCart = (product: CoffeeProduct, quantity: number, size: string) => {
    const newItem: CartItem = {
      product,
      quantity,
      size,
    };
    setItems((prevCart) => [...prevCart, newItem]);
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    setItems((prevCart) =>
      prevCart.map((item, i) => (i === index ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (index: number) => {
    setItems((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const updateDeliOption = useCallback((value: DeliOption) => {
    setDeliOption(value);
  }, []);

  const updatePaymentMethod = useCallback((value: PaymentMethod) => {
    setPaymentMethod(value);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      deliOption,
      updateDeliOption,
      subTotal,
      deliFee,
      totalPayment,
      paymentMethod,
      updatePaymentMethod,
      clearCart,
    }),
    [items, deliOption, paymentMethod]
  );

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;
