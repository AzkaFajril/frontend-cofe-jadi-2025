export function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function formatPrice(price?: number): string {
  if (typeof price !== 'number' || isNaN(price)) return '-';
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'ind',
  });
}

export const priceWithSign = (price: number) => `${formatPrice(price)}`;

export function getSumFromArr(numberArr: number[]): number {
  return numberArr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

export const fakeTimer = (milliseconds: number = 1000): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}
export function formatRupiah(amount?: number) {
  if (typeof amount !== 'number' || isNaN(amount)) return '-';
  return amount.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

export function formatRupiahTanpaDesimal(amount?: number) {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return '';
  return 'Rp' + amount.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
