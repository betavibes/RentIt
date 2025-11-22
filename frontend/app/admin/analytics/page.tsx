'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/api';

export default function AdminAnalyticsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const [revenueSummary, setRevenueSummary] = useState<any>(null);
    const [orderStats, setOrderStats] = useState<any>(null);
    const [popularProducts, setPopularProducts] = useState<any[]>([]);
    const [customerStats, setCustomerStats] = useState<any>(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        if (user.role !== 'admin') {
            router.push('/');
            return;
        }
        fetchAnalytics();
    }, [user]);

    const fetchAnalytics = async () => {
        try {
            const [revenue, orders, products, customers, monthly, activity] = await Promise.all([
                api.getRevenueSummary(),
                api.getOrderStats(),
                api.getPopularProducts(),
                api.getCustomerStats(),
                api.getMonthlyRevenue(),
                api.getRecentActivity()
            ]);

            setRevenueSummary(revenue);
            setOrderStats(orders);
            setPopularProducts(products);
            setCustomerStats(customers);
            setMonthlyRevenue(monthly);
            setRecentActivity(activity);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading analytics...</div>
            </div>
        );
    }

    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Analytics & Reports</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 border border-white/10">
                        <div className="text-blue-100 text-sm font-medium mb-2">Total Revenue</div>
                        <div className="text-white text-3xl font-bold">₹{revenueSummary?.totalRevenue?.toLocaleString() || 0}</div>
                        <div className="text-blue-100 text-xs mt-2">All time</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 border border-white/10">
                        <div className="text-green-100 text-sm font-medium mb-2">Total Orders</div>
                        <div className="text-white text-3xl font-bold">{orderStats?.totalOrders || 0}</div>
                        <div className="text-green-100 text-xs mt-2">
                            {orderStats?.completedOrders || 0} completed
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 border border-white/10">
                        <div className="text-purple-100 text-sm font-medium mb-2">Total Customers</div>
                        <div className="text-white text-3xl font-bold">{customerStats?.totalCustomers || 0}</div>
                        <div className="text-purple-100 text-xs mt-2">
                            {customerStats?.activeCustomers || 0} active
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 border border-white/10">
                        <div className="text-orange-100 text-sm font-medium mb-2">Monthly Revenue</div>
                        <div className="text-white text-3xl font-bold">₹{revenueSummary?.monthlyRevenue?.toLocaleString() || 0}</div>
                        <div className="text-orange-100 text-xs mt-2">This month</div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-slate-800 rounded-xl p-6 border border-white/10 mb-8">
                    <h2 className="text-xl font-bold text-white mb-6">Revenue Trend (Last 12 Months)</h2>
                    <div className="space-y-3">
                        {monthlyRevenue.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-24 text-sm text-slate-400">{item.month}</div>
                                <div className="flex-1 bg-slate-700 rounded-full h-8 relative overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full flex items-center px-3 transition-all"
                                        style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                                    >
                                        {item.revenue > 0 && (
                                            <span className="text-white text-xs font-medium">
                                                ₹{item.revenue.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Popular Products */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4">Popular Products</h2>
                        {popularProducts.length > 0 ? (
                            <div className="space-y-3">
                                {popularProducts.map((product, index) => (
                                    <div key={product.productId} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="text-white font-medium">{product.productName}</div>
                                        </div>
                                        <div className="text-blue-400 font-bold">{product.rentalCount} rentals</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400">No data available</p>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
                        {recentActivity.length > 0 ? (
                            <div className="space-y-3">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="p-3 bg-slate-700 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-white font-medium">{activity.customer_name}</div>
                                            <div className={`text-xs px-2 py-1 rounded ${activity.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                                                    activity.status === 'confirmed' ? 'bg-blue-500/20 text-blue-300' :
                                                        activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                                            'bg-red-500/20 text-red-300'
                                                }`}>
                                                {activity.status}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="text-slate-400">
                                                {new Date(activity.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="text-blue-400 font-bold">₹{activity.total_amount}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400">No recent activity</p>
                        )}
                    </div>
                </div>

                {/* Order Status Breakdown */}
                <div className="bg-slate-800 rounded-xl p-6 border border-white/10 mt-8">
                    <h2 className="text-xl font-bold text-white mb-6">Order Status Breakdown</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center p-4 bg-slate-700 rounded-lg">
                            <div className="text-2xl font-bold text-white">{orderStats?.totalOrders || 0}</div>
                            <div className="text-sm text-slate-400 mt-1">Total</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-300">{orderStats?.pendingOrders || 0}</div>
                            <div className="text-sm text-yellow-200 mt-1">Pending</div>
                        </div>
                        <div className="text-center p-4 bg-blue-500/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-300">{orderStats?.confirmedOrders || 0}</div>
                            <div className="text-sm text-blue-200 mt-1">Confirmed</div>
                        </div>
                        <div className="text-center p-4 bg-green-500/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-300">{orderStats?.completedOrders || 0}</div>
                            <div className="text-sm text-green-200 mt-1">Completed</div>
                        </div>
                        <div className="text-center p-4 bg-red-500/20 rounded-lg">
                            <div className="text-2xl font-bold text-red-300">{orderStats?.cancelledOrders || 0}</div>
                            <div className="text-sm text-red-200 mt-1">Cancelled</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
