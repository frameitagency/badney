export interface ProductColor {
  name: string;
  value: string; // Tailwind hex or class name
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  category: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: ProductColor[];
  details?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  id: string; // composite key: productId_size_color
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface CheckoutDetails {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  notes?: string;
  paymentMethod: string; // WhatsApp Direct
  shippingMethod: string; // e.g. Standard, Express, Collection
}
