import { useShoppingCart } from '@/hooks/useShoppingCart';
import Title6 from '@/components/shared/typo/Title6';
import PriceRow from '@/components/shared/PriceRow';
import { priceWithSign, formatRupiahTanpaDesimal } from '@/utils/helper';

export default function OrderSummary() {
  // Shopping Cart
  const { items, subTotal, deliFee } = useShoppingCart();

  return (
    <div>
      <Title6>Order Summary</Title6>
      <table className="w-full mt-2">
        <tbody className='space-y-2'>
          {items?.map((item) => {
            const productWithSizes = item.product as any;
            const sizes = productWithSizes.sizes as { name: string; price: number }[] | undefined;
            let price = item.product.price;
            if (sizes && sizes.length > 0 && item.size) {
              const sizeObj = sizes.find(s => s.name?.toLowerCase() === item.size?.toLowerCase());
              if (sizeObj) price = sizeObj.price;
            }
            return (
            <tr
                key={item.product.id + (item.size || '')}
              className="flex items-center justify-between text-sm font-normal text-neutral-800"
            >
              <td className="text-left w-[2rem]">{`${item.quantity}x `}</td>
              <td className="text-left w-[calc(100%-9rem)] line-clamp-1">
                {item.product.displayName}
                  {item.size && (
                    <span className="ml-2 text-xs text-gray-500">({item.size.charAt(0).toUpperCase() + item.size.slice(1)})</span>
                  )}
              </td>
              <td className="text-right w-[7rem] overflow-hidden pl-2">
                  {formatRupiahTanpaDesimal(price * item.quantity)}
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
      <hr className="my-2" />
      <PriceRow lable="Sub Total" amount={subTotal} />
      <PriceRow lable="Delivery Fee" amount={deliFee} />
    </div>
  );
}
