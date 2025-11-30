'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api/api';
import { Order } from '@/lib/types';

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        if (user.role === 'admin') {
            router.push('/admin/dashboard');
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const ordersData = await api.getMyOrders();
            setRecentOrders(ordersData.slice(0, 3));
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    const menuItems = [
        { icon: '📦', label: 'Your Orders', href: '/orders', description: 'Track, return, or buy things again' },
        { icon: '👤', label: 'Login & Security', href: '/profile', description: 'Edit name, email, and password' },
        { icon: '📍', label: 'Your Addresses', href: '/profile', description: 'Edit addresses for orders' },
        { icon: '🔔', label: 'Notifications', href: '/notifications', description: 'View your notifications' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Your Account</h1>
                </div>

                {/* Account Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg p-6 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-3xl">{item.icon}</div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                                        {item.label}
                                    </h3>
                                    <p className="text-slate-400 text-sm">{item.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Recent Orders Section */}
                <div className="bg-slate-800 border border-white/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Your Orders</h2>
                        {recentOrders.length > 0 && (
                            <Link href="/orders" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                See all orders →
                            </Link>
                        )}
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg">
                            <div className="text-4xl mb-4">📦</div>
                            <p className="text-slate-400 mb-2">You haven't placed any orders yet</p>
                            <Link href="/products" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase mb-1">
                                                Order Placed: {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                Order ID: #{order.display_id || order.id.slice(0, 8).toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-white font-semibold">₹{order.totalAmount}</div>
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                                                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-700 pt-3 mt-3">
                                        <div className="text-sm text-slate-400 mb-2">
                                            Rental Period: {new Date(order.rentalStartDate).toLocaleDateString('en-GB')} - {new Date(order.rentalEndDate).toLocaleDateString('en-GB')}
                                        </div>
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="inline-block bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                                        >
                                            View Order Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Browse Section */}
                <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-1">Discover New Styles</h3>
                            <p className="text-slate-300 text-sm">Browse our latest collection of premium dresses</p>
                        </div>
                        <Link
                            href="/products"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
                        >
                            Browse Collection
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
