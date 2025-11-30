'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/api';
import { Order } from '@/lib/types';
import Link from 'next/link';

export default function OrdersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = await api.getMyOrders();
            setOrders(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            confirmed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            active: 'bg-green-500/20 text-green-300 border-green-500/30',
            completed: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
            cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
        };
        return colors[status] || colors.pending;
    };

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        try {
            await api.cancelOrder(orderId);
            fetchOrders();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-900 text-white p-8"><div className="max-w-6xl mx-auto"><div className="text-center py-20">Loading orders...</div></div></div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>
                {error && <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">{error}</div>}
                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-400 mb-4">No orders yet</p>
                        <Link href="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-slate-800 rounded-xl p-6 border border-white/10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold">Order #{order.display_id || order.id.slice(0, 8)}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>{order.status.toUpperCase()}</span>
                                        </div>
                                        <p className="text-sm text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">₹{order.totalAmount + order.depositAmount}</div>
                                        <p className="text-xs text-slate-400">incl. ₹{order.depositAmount} deposit</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div><span className="text-slate-400">Rental Period:</span><p className="font-medium">{new Date(order.rentalStartDate).toLocaleDateString('en-GB')} - {new Date(order.rentalEndDate).toLocaleDateString('en-GB')}</p></div>
                                    {order.items && <div><span className="text-slate-400">Items:</span><p className="font-medium">{order.items.length} product(s)</p></div>}
                                </div>
                                <div className="flex gap-3">
                                    <Link href={`/orders/${order.id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-medium transition-colors">View Details</Link>
                                    {(order.status === 'pending' || order.status === 'confirmed') && <button onClick={() => handleCancelOrder(order.id)} className="px-6 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 py-2 rounded-lg font-medium transition-colors">Cancel</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
