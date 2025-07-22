import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { classNames } from '@/utils/helper';
import Title6 from '@/components/shared/typo/Title6';
import { CoffeeSize } from '@/types';
import { coffeeSizeOptions } from '@/constants/constants';

interface ProductSizeSwitchProps {
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  sizes: { name: string; price: number }[];
}

export default function ProductSizeSwitch({ selectedSize, setSelectedSize, sizes }: ProductSizeSwitchProps) {
  const selectedSizeObj = sizes.find(s => s.name?.toLowerCase() === selectedSize?.toLowerCase());
  return (
    <div>
      <Title6 className="mb-2">Size</Title6>
      <RadioGroup value={selectedSize} onChange={setSelectedSize}>
        <RadioGroup.Label className="sr-only">Coffee size</RadioGroup.Label>
        <div className="flex flex-row gap-4 ">
          {sizes.map((option) => (
            <RadioGroup.Option
              key={option.name}
              value={option.name}
              className={({ checked }) =>
                classNames(
                  'flex items-center justify-center px-4 py-1 border rounded-xl',
                  checked
                    ? 'bg-primary-50 border-primary-600'
                    : 'bg-white border-neutral-200'
                )
              }
            >
              {option.name}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      {selectedSizeObj && (
        <div className="mt-2 text-sm text-gray-600">
          <b>Harga:</b> Rp {selectedSizeObj.price.toLocaleString('id-ID')}
        </div>
      )}
    </div>
  );
}
