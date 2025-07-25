export interface LatLng {
  lat: number;
  lng: number;
}

export interface UserAddress {
  fullAddress: string;
  coordinates: LatLng;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string; // 'user' | 'admin'
}

export interface UserWithAddress extends AuthUser {
  address?: UserAddress;
}

export enum CoffeeType {
  Hot = 'hot',
  Iced = 'iced',
}

export interface CoffeeProduct {
  id: string;
  displayName: string;
  type: CoffeeType;
  price: number;
  description: string;
  image: string;
  category?: string;
  sizes?: { name: string; price: number }[]; // Tambahan agar produk bisa punya banyak size
}

export interface CartItem {
  product: CoffeeProduct;
  quantity: number;
  size: string; // CoffeeSize
}

export enum DeliOption {
  DELIVER = 'delivery',
  PICK_UP = 'pick-up',
  IN_PLACE = 'in-place',
}

export enum PaymentMethod {
  CASH = 'cash',
  KBZ_PAY = 'kbz-pay',
  WAVE_MONEY = 'wave-money',
}

export enum CoffeeSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  coordinates: LatLng;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string; // Tambahan agar bisa tampilkan size
}

export interface DeliveryOrder {
  id: string;
  _id?: string; // MongoDB document id
  orderId?: string; // Short order code
  customer?: Customer;
  items: OrderItem[];
  deliOption: DeliOption;
  paymentMethod: PaymentMethod;
  totalPayment: number;
  date: string;
  image: string;
  orderType?: string;
  tableNumber?: string;
  statusPesanan?: string; // Tambahan agar bisa akses status pesanan dari API
  deliveryType?: string; // Tambahan agar bisa akses deliveryType dari API
}

export type HeroIcon = React.ComponentType<
  React.PropsWithoutRef<React.ComponentProps<'svg'>> & {
    title?: string | undefined;
    titleId?: string | undefined;
  }
>;
