export interface Order {
  id: string;
  user_id: string;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'shipped' | 'delivered';
  total_amount: number; 
  currency: string;
  shipping_address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
  billing_address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
  customer_email?: string;
  customer_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
  name: string;
  price: number; 
  quantity: number;
  image_url?: string;
  created_at: string;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface CreateOrderData {
  items: Array<{
    product_id?: string;
    stripe_product_id: string;
    stripe_price_id?: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
    type?: 'product' | 'service';
    duration?: string;
  }>;
  shipping_address?: Order['shipping_address'];
  billing_address?: Order['billing_address'];
  customer_email?: string;
  customer_name?: string;
  notes?: string;
}

export interface CheckoutSessionData {
  order_id: string;
  session_url: string;
} 