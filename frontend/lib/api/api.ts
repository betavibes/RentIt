import axios, { AxiosInstance, AxiosError } from 'axios';
import { LoginCredentials, RegisterData, AuthResponse, User, Product, Category, Order, OrderItem } from '../types';

const API_URL = 'http://localhost:5000/api';

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.client.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response.data,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    this.clearToken();
                    if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/')) {
                        window.location.href = '/auth/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    private getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }

    private setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    }

    private clearToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const data = await this.client.post<AuthResponse>('/auth/login', credentials);
        const response = data as unknown as AuthResponse;
        this.setToken(response.token);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    }

    async register(userData: RegisterData): Promise<AuthResponse> {
        const data = await this.client.post<AuthResponse>('/auth/register', userData);
        const response = data as unknown as AuthResponse;
        this.setToken(response.token);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    }

    async getCurrentUser(): Promise<User> {
        const data = await this.client.get<User>('/auth/me');
        return data as unknown as User;
    }

    async logout(): Promise<void> {
        this.clearToken();
    }

    // Admin Methods
    async getAllUsers(): Promise<User[]> {
        const data = await this.client.get<User[]>('/admin/users');
        return data as unknown as User[];
    }

    async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
        const data = await this.client.patch<User>(`/admin/users/${userId}/status`, { isActive });
        return data as unknown as User;
    }

    async updateUserRole(userId: string, role: string): Promise<User> {
        const data = await this.client.patch<User>(`/admin/users/${userId}/role`, { role });
        return data as unknown as User;
    }

    // Product & Category Methods
    async getCategories(): Promise<Category[]> {
        const data = await this.client.get<Category[]>('/products/categories/all');
        return data as unknown as Category[];
    }

    async getProducts(filters?: any): Promise<Product[]> {
        const data = await this.client.get<Product[]>('/products', { params: filters });
        return data as unknown as Product[];
    }

    async getProductById(id: string): Promise<Product> {
        const data = await this.client.get<Product>(`/products/${id}`);
        return data as unknown as Product;
    }

    // Admin Product Methods
    async createCategory(data: Partial<Category>): Promise<Category> {
        const res = await this.client.post<Category>('/products/categories', data);
        return res as unknown as Category;
    }

    async createProduct(data: Partial<Product> & { images: string[] }): Promise<Product> {
        const res = await this.client.post<Product>('/products', data);
        return res as unknown as Product;
    }

    async updateProductStatus(id: string, condition: string): Promise<Product> {
        const res = await this.client.patch<Product>(`/products/${id}/status`, { condition });
        return res as unknown as Product;
    }

    // Update full product details (including images)
    async updateProduct(id: string, data: Partial<Product> & { images?: string[] }): Promise<Product> {
        const res = await this.client.put<Product>(`/products/${id}`, data);
        return res as unknown as Product;
    }

    // Rental/Order Methods
    async createOrder(orderData: any): Promise<Order> {
        const res = await this.client.post<Order>('/rentals', orderData);
        return res as unknown as Order;
    }

    async getMyOrders(): Promise<Order[]> {
        const res = await this.client.get<Order[]>('/rentals/my-orders');
        return res as unknown as Order[];
    }

    async getOrderById(id: string): Promise<Order> {
        const res = await this.client.get<Order>(`/rentals/${id}`);
        return res as unknown as Order;
    }

    async getAllOrders(filters?: any): Promise<Order[]> {
        const res = await this.client.get<Order[]>('/rentals', { params: filters });
        return res as unknown as Order[];
    }

    async updateOrderStatus(id: string, status: string, data?: any): Promise<Order> {
        const res = await this.client.patch<Order>(`/rentals/${id}/status`, { status, ...data });
        return res as unknown as Order;
    }

    async cancelOrder(id: string): Promise<any> {
        const res = await this.client.delete(`/rentals/${id}`);
        return res;
    }

    // Payment Methods
    async initiatePayment(orderId: string): Promise<any> {
        const res = await this.client.post('/payments/initiate', { orderId });
        return res;
    }

    async processPayment(paymentId: string, paymentMethod: string, paymentDetails: any): Promise<any> {
        const res = await this.client.post('/payments/process', { paymentId, paymentMethod, paymentDetails });
        return res;
    }

    async getPaymentStatus(paymentId: string): Promise<any> {
        const res = await this.client.get(`/payments/${paymentId}/status`);
        return res;
    }

    async refundPayment(paymentId: string): Promise<any> {
        const res = await this.client.post(`/payments/${paymentId}/refund`);
        return res;
    }

    // User Profile Methods
    async getProfile(): Promise<any> {
        const res = await this.client.get('/users/profile');
        return res;
    }

    async updateProfile(data: any): Promise<any> {
        const res = await this.client.put('/users/profile', data);
        return res;
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<any> {
        const res = await this.client.put('/users/password', { oldPassword, newPassword });
        return res;
    }

    async getDashboardStats(): Promise<any> {
        const res = await this.client.get('/users/dashboard/stats');
        return res;
    }

    // Review Methods
    async createReview(data: any): Promise<any> {
        const res = await this.client.post('/reviews', data);
        return res;
    }

    async getProductReviews(productId: string): Promise<any> {
        const res = await this.client.get(`/reviews/product/${productId}`);
        return res;
    }

    async getUserReviews(): Promise<any> {
        const res = await this.client.get('/reviews/my-reviews');
        return res;
    }

    async updateReview(id: string, data: any): Promise<any> {
        const res = await this.client.put(`/reviews/${id}`, data);
        return res;
    }

    async deleteReview(id: string): Promise<any> {
        const res = await this.client.delete(`/reviews/${id}`);
        return res;
    }

    async getProductRating(productId: string): Promise<any> {
        const res = await this.client.get(`/reviews/product/${productId}/rating`);
        return res;
    }

    // Settings Methods
    async getAllSettings(): Promise<any> {
        const res = await this.client.get('/settings');
        return res;
    }

    async getSettingsByCategory(category: string): Promise<any> {
        const res = await this.client.get(`/settings/category/${category}`);
        return res;
    }

    async updateSetting(key: string, value: string): Promise<any> {
        const res = await this.client.put(`/settings/${key}`, { value });
        return res;
    }

    async updateMultipleSettings(settings: any[]): Promise<any> {
        const res = await this.client.put('/settings/bulk/update', { settings });
        return res;
    }

    // Analytics Methods
    async getRevenueSummary(): Promise<any> {
        const res = await this.client.get('/analytics/revenue');
        return res;
    }

    async getOrderStats(): Promise<any> {
        const res = await this.client.get('/analytics/orders');
        return res;
    }

    async getPopularProducts(): Promise<any> {
        const res = await this.client.get('/analytics/products/popular');
        return res;
    }

    async getCustomerStats(): Promise<any> {
        const res = await this.client.get('/analytics/customers');
        return res;
    }

    async getMonthlyRevenue(): Promise<any> {
        const res = await this.client.get('/analytics/revenue/monthly');
        return res;
    }

    async getRecentActivity(): Promise<any> {
        const res = await this.client.get('/analytics/activity/recent');
        return res;
    }

    // Notification Methods
    async getNotifications(limit = 20, offset = 0): Promise<any> {
        const res = await this.client.get(`/notifications?limit=${limit}&offset=${offset}`);
        return res;
    }

    async markNotificationAsRead(id: string): Promise<any> {
        const res = await this.client.put(`/notifications/${id}/read`);
        return res;
    }

    async markAllNotificationsAsRead(): Promise<any> {
        const res = await this.client.put('/notifications/read-all');
        return res;
    }

    async deleteNotification(id: string): Promise<any> {
        const res = await this.client.delete(`/notifications/${id}`);
        return res;
    }
}

const api = new ApiService();
export default api;
