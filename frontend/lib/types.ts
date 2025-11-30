export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'staff' | 'customer';
    phoneNumber?: string;
    gender?: string;
    size?: string;
    college?: string;
    isActive?: boolean;
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
}

export interface Occasion {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface AgeGroup {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface ProductImage {
    id: string;
    url: string;
    isPrimary: boolean;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    deposit: number;
    categoryId: string;
    categoryName?: string;
    occasionId?: string;
    occasionName?: string;
    ageGroupId?: string;
    ageGroupName?: string;
    size?: string;
    color?: string;
    condition: 'available' | 'rented' | 'laundry' | 'damaged';
    status?: 'active' | 'inactive';
    isFeatured: boolean;
    images?: ProductImage[];
    imageUrl?: string;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface Order {
    id: string;
    display_id?: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    userPhone?: string;
    totalAmount: number;
    depositAmount: number;
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
    rentalStartDate: string;
    rentalEndDate: string;
    actualReturnDate?: string;
    notes?: string;
    items?: OrderItem[];
    itemCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    productName?: string;
    productImage?: string;
    dailyRate: number;
    deposit: number;
    quantity: number;
    subtotal: number;
    createdAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
    rentalStartDate?: string;
    rentalEndDate?: string;
}

export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    paymentMethod: 'card' | 'upi' | 'wallet';
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    transactionId: string;
    paymentGatewayResponse?: any;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentIntent {
    paymentId: string;
    orderId: string;
    amount: number;
    transactionId: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    role: 'admin' | 'customer';
    createdAt: string;
}

export interface DashboardStats {
    activeRentals: number;
    upcomingReturns: number;
    totalOrders: number;
    totalSpent: number;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    orderId: string;
    userName: string;
    rating: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductRating {
    averageRating: number;
    totalReviews: number;
}

export interface Setting {
    id: string;
    key: string;
    value: string;
    category: string;
    description?: string;
    updatedAt: string;
}

export interface RevenueSummary {
    totalRevenue: number;
    monthlyRevenue: number;
    dailyRevenue: number;
}

export interface OrderStats {
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    completedOrders: number;
    cancelledOrders: number;
}

export interface PopularProduct {
    productId: string;
    productName: string;
    rentalCount: number;
}

export interface CustomerStats {
    totalCustomers: number;
    activeCustomers: number;
}

export interface MonthlyRevenue {
    month: string;
    revenue: number;
}

export interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}
