import BaseModal from '@/components/shared/modal/BaseModal';
import { useState, useEffect } from 'react';
import { CoffeeProduct, CoffeeSize } from '@/types';
import Footer from './Footer';
import ProductSizeSwitch from './ProductSizeSwitch';
import ProductInfo from './ProductInfo';
import ProductImage from './ProductImage';

interface ProductDetailModalProps {
  product: CoffeeProduct | null;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      const small = product.sizes.find(s => s.name?.toLowerCase() === 'small');
      if (small) setSelectedSize(small.name);
      else {
        const cheapest = product.sizes.reduce((min, curr) =>
          curr.price < min.price ? curr : min
        );
        setSelectedSize(cheapest.name);
      }
    } else {
      setSelectedSize('');
    }
  }, [product]);

  return (
    <BaseModal show={!!product} onClose={onClose}>
      {product && (
        <>
          <ProductImage product={product} onClose={onClose} />
          <div className="p-4 pb-8">
            <ProductInfo product={product} selectedSize={selectedSize} />
            <hr className="my-4" />
            <ProductSizeSwitch
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              sizes={product.sizes || []}
            />
          </div>
          <Footer product={product} onClose={onClose} selectedSize={selectedSize} />
        </>
      )}
    </BaseModal>
  );
}
