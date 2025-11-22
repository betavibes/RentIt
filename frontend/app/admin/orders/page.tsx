'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/api';
import { Order } from '@/lib/types';
import Link from 'next/link';

export default function AdminOrdersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.push('/');
            return;
        }
        fetchOrders();
    }, [user, filter]);

    const fetchOrders = async () => {
        try {
            const filters = filter !== 'all' ? { status: filter } : {};
            const data = await api.getAllOrders(filters);
            setOrders(data);
        } catch (err) {
            console.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await api.updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            pending: 'bg-yellow-500/20 text-yellow-300',
            confirmed: 'bg-blue-500/20 text-blue-300',
            active: 'bg-green-500/20 text-green-300',
            completed: 'bg-slate-500/20 text-slate-300',
            cancelled: 'bg-red-500/20 text-red-300',
        };
        return colors[status] || colors.pending;
    };

    if (loading) return <div className="min-h-screen bg-slate-900 text-white p-8"><div className="text-center py-20">Loading...</div></div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Order Management</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    {['all', 'pending', 'confirmed', 'active', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`p-4 rounded-xl border transition-all ${filter === status
                                    ? 'bg-blue-600 border-blue-500'
                                    : 'bg-slate-800 border-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className="text-2xl font-bold">{orders.filter(o => status === 'all' || o.status === status).length}</div>
                            <div className="text-sm text-slate-400 capitalize">{status}</div>
                        </button>
                    ))}
                </div>

                {/* Orders Table */}
                <div className="bg-slate-800 rounded-xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Items</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Rental Period</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-700/50">
                                        <td className="px-6 py-4 text-sm font-mono">#{order.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium">{order.userName}</div>
                                            <div className="text-xs text-slate-400">{order.userEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{order.itemCount || order.items?.length || 0}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {new Date(order.rentalStartDate).toLocaleDateString()} - {new Date(order.rentalEndDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold">₹{order.totalAmount + order.depositAmount}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="active">Active</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                            >
                                                View Details →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {orders.length === 0 && (
                        <div className="text-center py-12 text-slate-400">No orders found</div>
                    )}
                </div>
            </div>
        </div>
    );
}
