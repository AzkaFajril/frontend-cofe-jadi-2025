import { priceWithSign, formatRupiahTanpaDesimal } from '@/utils/helper';
import LabelValueRow from './LabelValueRow';

interface PriceRowProps {
  lable: string;
  amount: number;
}
export default function PriceRow({ lable, amount }: PriceRowProps) {
  return <LabelValueRow lable={lable} value={formatRupiahTanpaDesimal(amount)} />;
}
