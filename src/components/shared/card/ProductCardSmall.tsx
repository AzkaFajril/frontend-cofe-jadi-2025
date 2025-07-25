import { PlusIcon } from '@heroicons/react/24/solid';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { useModal } from '@/hooks/useModal';
import { classNames, priceWithSign, formatRupiahTanpaDesimal } from '@/utils/helper';
import { ProductCardProps } from './type';


export default function ProductCardSmall({ coffee }: ProductCardProps) {
  // Shopping Cart
  const { items } = useShoppingCart();
  const isSameItem = items?.filter((i) => i.product.id === coffee.id)[0];
  // Modal Provider
  const { showProductModal } = useModal();

  const handleClick = () => {
    showProductModal(coffee);
  };

  // Logic harga sesuai size
  const sizes = (coffee as any).sizes as { name: string; price: number }[] | undefined;
  let displayPrice = coffee.price;
  if (sizes && sizes.length > 0) {
    // Urutkan prioritas: Small > Medium > Large > size pertama
    const small = sizes.find(s => s.name?.toLowerCase() === 'small');
    const medium = sizes.find(s => s.name?.toLowerCase() === 'medium');
    const large = sizes.find(s => s.name?.toLowerCase() === 'large');
    if (small) displayPrice = small.price;
    else if (medium) displayPrice = medium.price;
    else if (large) displayPrice = large.price;
    else displayPrice = sizes[0].price;
  }

  return (
    <button
      onClick={handleClick}
      className="relative w-full h-56 bg-white hover:bg-primary-50 border rounded-2xl p-2 ease-in"
    >
      <img
        src={coffee.image}
        alt={coffee.displayName}
        className="w-full h-32 object-cover bg-gray-300 rounded-xl"
      />
      <div className="flex flex-col justify-between h-20 text-left py-1">
          <p className="font-bold text-neutral-800 line-clamp-2">
            {coffee.displayName}
          </p>
          <p className="font-semibold text-teal-900">
            {formatRupiahTanpaDesimal(displayPrice)}
          </p>
      </div>
      <div className="absolute bottom-2 right-2">
        <div
          className={classNames(
            'inline-flex items-center justify-center w-7 h-7 rounded-full',
            isSameItem
              ? 'text-primary border border-primary'
              : 'bg-primary text-white'
          )}
        >
          {isSameItem ? (
            <span className="text-sm font-semibold">{isSameItem.quantity}</span>
          ) : (
            <PlusIcon className="h-5 w-5" />
          )}
        </div>
      </div>
    </button>
  );
}
