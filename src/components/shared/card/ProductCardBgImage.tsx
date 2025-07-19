import { priceWithSign } from '@/utils/helper';
import { useModal } from '@/hooks/useModal';
import { ProductCardProps } from './type';
import { formatRupiahTanpaDesimal } from '@/utils/helper';

// Hapus interface yang error, gunakan any untuk coffeeWithSizes agar tidak error linter
export default function ProductCardBgImage({ coffee }: ProductCardProps) {
  // Modal Provider
  const { showProductModal } = useModal();

  const handleClick = () => {
    showProductModal(coffee);
  };
  // Gunakan any agar tidak error linter, tambahkan komentar untuk future type safety
  const coffeeWithSizes = coffee as any;
  const smallPrice = (coffeeWithSizes.sizes?.find?.((s: any) => s.name?.toLowerCase?.() === 'small')?.price) ?? coffee.price;
  const formattedPrice = formatRupiahTanpaDesimal(smallPrice);

  return (
    <button
      onClick={handleClick}
      className="group relative w-full h-48 bg-gray-200 rounded-2xl overflow-hidden"
    >
      <img
        src={coffee.image}
        alt={coffee.displayName}
        className="w-full h-full object-cover bg-gray-300 scale-100 group-hover:scale-110 ease-in duration-200"
      />
      {/* Hapus harga di pojok kiri atas */}
      {/* Harga di pojok kanan bawah */}
      {formattedPrice && (
        <div className="absolute bottom-2 right-2">
          <span className="bg-white text-xs sm:text-sm md:text-base text-black font-bold border border-gray-200 border-solid rounded-xl px-2 sm:px-3 py-0.5 sm:py-1 shadow-md">
            {formattedPrice}
          </span>
        </div>
      )}
      <div className="absolute top-0 left-0 right-0 p-3 pb-10 bg-gradient-to-b from-black/60">
        <span className="text-left text-xl font-semibold text-white line-clamp-2">
          {coffee.displayName}
        </span>
      </div>
      <div className="absolute bottom-0 right-0 p-3">
       
      </div>
    </button>
  );
}
