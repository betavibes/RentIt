'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!orderId) {
            setError('No order ID provided');
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            try {
                const data = await api.getOrderById(orderId);
                setOrder(data);
            } catch (err) {
                console.error('Failed to fetch order:', err);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-8 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                    <p className="text-slate-400 mb-6">{error || 'Order not found'}</p>
                    <Link href="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                        Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-2xl mx-auto pt-10">
                <div className="bg-slate-800 rounded-2xl p-8 border border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
                        <p className="text-slate-400">Thank you for your order. We'll process it shortly.</p>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-6 mb-8 space-y-4">
                        <div className="flex justify-between border-b border-white/10 pb-4">
                            <span className="text-slate-400">Order ID</span>
                            <span className="font-mono font-semibold text-blue-400">{order.display_id || order.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-4">
                            <span className="text-slate-400">Date</span>
                            <span>{new Date(order.created_at).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-4">
                            <span className="text-slate-400">Payment Method</span>
                            <span className="uppercase font-semibold badge bg-slate-800 border border-slate-600 px-2 py-0.5 rounded text-xs">
                                {order.paymentMethod || 'COD'}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="text-slate-400">Total Amount</span>
                            <span className="text-xl font-bold text-green-400">
                                ₹{(parseFloat(order.total_amount) + parseFloat(order.deposit_amount)).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/orders/${order.id}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-center text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            View Order Details
                        </Link>
                        <Link
                            href="/products"
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-center text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <OrderSuccessContent />
        </Suspense>
    );
}
