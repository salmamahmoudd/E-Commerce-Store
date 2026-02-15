export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  _id?: string;
  userId?: string;
  items: OrderItem[];
  total: number;
status?: 'pending' | 'cash-paid' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled_by_user' | 'cancelled_by_admin' | 'refund_requested' | 'refunded' | 'refund_rejected';
  createdAt?: string;
  updatedAt?: string;
  deliveredAt?: string;
}



export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrder {
  items: {
    productId: string;
    quantity: number;
    priceAtAdd: number;
  }[];
  total: number;
  name?: string;      
  address?: string;   
  phone?: string;     
  paymentMethod?: string; 
}


