'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api/api';

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>({
        revenue: null,
        orders: null,
        customers: null,
        recentOrders: []
    });

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        if (user.role !== 'admin') {
            router.push('/');
            return;
        }
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const [revenue, orders, customers, activity] = await Promise.all([
                api.getRevenueSummary(),
                api.getOrderStats(),
                api.getCustomerStats(),
                api.getRecentActivity()
            ]);

            setStats({
                revenue,
                orders,
                customers,
                recentOrders: activity.slice(0, 5)
            });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading dashboard...</div>
            </div>
        );
    }

    const quickLinks = [
        { title: 'Manage Products', href: '/admin/inventory', icon: '📦', description: 'Add, edit, or remove products' },
        { title: 'View Orders', href: '/admin/orders', icon: '📋', description: 'Manage customer orders' },
        { title: 'Analytics', href: '/admin/analytics', icon: '📊', description: 'View detailed reports' },
        { title: 'Settings', href: '/admin/settings', icon: '⚙️', description: 'Configure platform settings' },
        { title: 'Manage Users', href: '/admin/users', icon: '👥', description: 'View and manage users' }
    ];

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-slate-400">Welcome back, {user?.name}!</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 border border-white/10">
                        <div className="text-blue-100 text-sm font-medium mb-2">Total Revenue</div>
                        <div className="text-white text-3xl font-bold">
                            ₹{stats.revenue?.totalRevenue?.toLocaleString() || 0}
                        </div>
                        <div className="text-blue-100 text-xs mt-2">All time</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 border border-white/10">
                        <div className="text-green-100 text-sm font-medium mb-2">Total Orders</div>
                        <div className="text-white text-3xl font-bold">{stats.orders?.totalOrders || 0}</div>
                        <div className="text-green-100 text-xs mt-2">
                            {stats.orders?.pendingOrders || 0} pending
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 border border-white/10">
                        <div className="text-purple-100 text-sm font-medium mb-2">Total Customers</div>
                        <div className="text-white text-3xl font-bold">{stats.customers?.totalCustomers || 0}</div>
                        <div className="text-purple-100 text-xs mt-2">
                            {stats.customers?.activeCustomers || 0} active
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 border border-white/10">
                        <div className="text-orange-100 text-sm font-medium mb-2">Monthly Revenue</div>
                        <div className="text-white text-3xl font-bold">
                            ₹{stats.revenue?.monthlyRevenue?.toLocaleString() || 0}
                        </div>
                        <div className="text-orange-100 text-xs mt-2">This month</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Quick Links */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{link.icon}</div>
                                        <div className="flex-1">
                                            <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                                                {link.title}
                                            </div>
                                            <div className="text-sm text-slate-400">{link.description}</div>
                                        </div>
                                        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                            <Link href="/admin/orders" className="text-sm text-blue-400 hover:text-blue-300">
                                View All
                            </Link>
                        </div>
                        {stats.recentOrders.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentOrders.map((order: any) => (
                                    <Link
                                        key={order.id}
                                        href={`/admin/orders/${order.id}`}
                                        className="block p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-white font-medium">{order.customer_name}</div>
                                            <div className={`text-xs px-2 py-1 rounded ${order.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                                                    order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-300' :
                                                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                                            'bg-red-500/20 text-red-300'
                                                }`}>
                                                {order.status}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="text-slate-400">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="text-blue-400 font-bold">₹{order.total_amount}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-center py-8">No recent orders</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
