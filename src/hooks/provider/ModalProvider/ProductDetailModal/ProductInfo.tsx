import { CoffeeProduct } from '@/types';
import { priceWithSign, formatRupiahTanpaDesimal } from '@/utils/helper';

interface ProductInfoProps {
  product: CoffeeProduct;
  selectedSize: string;
}

export default function ProductInfo({ product, selectedSize }: ProductInfoProps) {
  const productWithSizes = product as any;
  const sizes = productWithSizes.sizes as { name: string; price: number }[] | undefined;
  let price = product.price;
  if (sizes && sizes.length > 0) {
    const sizeObj = sizes.find(s => s.name?.toLowerCase() === selectedSize?.toLowerCase());
    if (sizeObj) price = sizeObj.price;
  }
  return (
    <div>
      <p className="text-xl font-semibold text-neutral-800">
        {product?.displayName}
      </p>
      <p className="text-sm font-normal text-neutral-400 mt-1">
        {product?.description}
      </p>
      <p className="text-lg font-semibold text-primary-600 mt-2">
        {formatRupiahTanpaDesimal(price)}
      </p>
    </div>
  );
}
