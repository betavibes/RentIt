export interface User {
  id: string;
  email: string;
  phone?: string;
  password_hash: string;
  full_name: string;
  gender?: string;
  size?: string;
  college?: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price_per_day: number;
  security_deposit: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface Rental {
  id: string;
  user_id: string;
  product_id: string;
  rental_start_date: Date;
  rental_end_date: Date;
  status: string;
  total_price: number;
  security_deposit: number;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  rental_id: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
