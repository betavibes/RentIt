'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import api from '@/lib/api/api';
import { Order } from '@/lib/types';

export default function AdminOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.push('/');
            return;
        }
        fetchOrder();
    }, [params.id, user]);

    const fetchOrder = async () => {
        try {
            const data = await api.getOrderById(params.id as string);
            setOrder(data);
            setNotes(data.notes || '');
        } catch (err) {
            console.error('Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            await api.updateOrderStatus(params.id as string, newStatus, { notes });
            fetchOrder();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update status');
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

    if (loading) return <div className="min-h-screen bg-slate-900 text-white p-8"><div className="text-center py-20">Loading...</div></div>;
    if (!order) return <div className="min-h-screen bg-slate-900 text-white p-8"><div className="text-center py-20 text-red-400">Order not found</div></div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => router.push('/admin/orders')} className="text-blue-400 hover:text-blue-300 mb-6">← Back to Orders</button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
                                    <p className="text-slate-400 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>{order.status.toUpperCase()}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm text-slate-400 mb-1">Customer</h3>
                                    <p className="font-medium">{order.userName}</p>
                                    <p className="text-sm text-slate-400">{order.userEmail}</p>
                                    {order.userPhone && <p className="text-sm text-slate-400">{order.userPhone}</p>}
                                </div>
                                <div>
                                    <h3 className="text-sm text-slate-400 mb-1">Rental Period</h3>
                                    <p className="font-medium">{new Date(order.rentalStartDate).toLocaleDateString()}</p>
                                    <p className="text-sm text-slate-400">to {new Date(order.rentalEndDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                                        <div className="w-16 h-20 bg-slate-700 rounded overflow-hidden">
                                            {item.productImage && <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{item.productName}</h3>
                                            <p className="text-sm text-slate-400">Qty: {item.quantity} | Rate: ₹{item.dailyRate}/day</p>
                                            <p className="text-sm text-slate-400">Deposit: ₹{item.deposit}</p>
                                            <p className="font-bold mt-1">₹{item.subtotal}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between"><span className="text-slate-400">Rental Amount</span><span>₹{order.totalAmount}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Deposit</span><span>₹{order.depositAmount}</span></div>
                                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-lg"><span>Total</span><span>₹{order.totalAmount + order.depositAmount}</span></div>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold mb-4">Update Status</h2>
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 mb-4"
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <label className="block text-sm text-slate-400 mb-2">Admin Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 mb-4"
                                rows={4}
                            />
                            <button
                                onClick={() => handleStatusUpdate(order.status)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
