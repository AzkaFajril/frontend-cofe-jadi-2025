import BaseModal from '@/components/shared/modal/BaseModal';
import { useState } from 'react';
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
  const [selectedSize, setSelectedSize] = useState<CoffeeSize>(CoffeeSize.SMALL);
  return (
    <BaseModal show={!!product} onClose={onClose}>
      {product && (
        <>
          <ProductImage product={product} onClose={onClose} />
          <div className="p-4 pb-8">
            <ProductInfo product={product} selectedSize={selectedSize} />
            <hr className="my-4" />
            <ProductSizeSwitch selectedSize={selectedSize} setSelectedSize={setSelectedSize} />
          </div>
          <Footer product={product} onClose={onClose} selectedSize={selectedSize} />
        </>
      )}
    </BaseModal>
  );
}
