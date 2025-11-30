'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import api from '@/lib/api/api';
import { Order } from '@/lib/types';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        fetchOrder();
    }, [params.id, user]);

    const fetchOrder = async () => {
        try {
            const data = await api.getOrderById(params.id as string);
            setOrder(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load order');
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

    const handleCancelOrder = async () => {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        try {
            await api.cancelOrder(params.id as string);
            router.push('/orders');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-900 text-white p-8"><div className="text-center py-20">Loading...</div></div>;
    if (error || !order) return <div className="min-h-screen bg-slate-900 text-white p-8"><div className="text-center py-20 text-red-400">{error || 'Order not found'}</div></div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => router.push('/orders')} className="text-blue-400 hover:text-blue-300 mb-6">← Back to Orders</button>

                <div className="bg-slate-800 rounded-xl p-8 border border-white/10 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Order #{order.display_id || order.id.slice(0, 8)}</h1>
                            <p className="text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>{order.status.toUpperCase()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-sm text-slate-400 mb-2">Rental Period</h3>
                            <p className="font-medium">{new Date(order.rentalStartDate).toLocaleDateString('en-GB')} - {new Date(order.rentalEndDate).toLocaleDateString('en-GB')}</p>
                        </div>
                        <div>
                            <h3 className="text-sm text-slate-400 mb-2">Total Amount</h3>
                            <p className="text-2xl font-bold">₹{order.totalAmount + order.depositAmount}</p>
                            <p className="text-xs text-slate-400">Includes ₹{order.depositAmount} deposit</p>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="mb-6">
                            <h3 className="text-sm text-slate-400 mb-2">Notes</h3>
                            <p className="text-slate-300">{order.notes}</p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-800 rounded-xl p-8 border border-white/10">
                    <h2 className="text-xl font-bold mb-4">Order Items</h2>
                    <div className="space-y-4">
                        {order.items?.map((item) => (
                            <div key={item.id} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                                <div className="w-20 h-24 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                                    {item.productImage && <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                                    <p className="text-sm text-slate-400">Quantity: {item.quantity}</p>
                                    <p className="text-sm text-slate-400">Daily Rate: ₹{item.dailyRate}</p>
                                    <p className="text-sm text-slate-400">Deposit: ₹{item.deposit}</p>
                                    <p className="font-bold mt-2">Subtotal: ₹{item.subtotal}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {(order.status === 'pending' || order.status === 'confirmed') && (
                    <div className="mt-6">
                        <button onClick={handleCancelOrder} className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 py-3 rounded-lg font-medium transition-colors">Cancel Order</button>
                    </div>
                )}
            </div>
        </div>
    );
}
