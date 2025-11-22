'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/api';
import DemoPaymentGateway from '@/components/DemoPaymentGateway';

export default function CheckoutPage() {
    const { cart, clearCart, getTotalAmount } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notes, setNotes] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [paymentId, setPaymentId] = useState('');

    const getTotalDeposit = () => {
        return cart.reduce((sum, item) => sum + (item.product.deposit * item.quantity), 0);
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            router.push('/auth/login');
            return;
        }

        if (cart.length === 0) {
            setError('Your cart is empty');
            return;
        }

        const invalidItems = cart.filter(item => !item.rentalStartDate || !item.rentalEndDate);
        if (invalidItems.length > 0) {
            setError('Please set rental dates for all items in cart');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const firstItem = cart[0];

            const orderData = {
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                })),
                rentalStartDate: firstItem.rentalStartDate,
                rentalEndDate: firstItem.rentalEndDate,
                notes
            };

            const order = await api.createOrder(orderData);
            setOrderId(order.id);

            // Initiate payment
            const payment = await api.initiatePayment(order.id);
            setPaymentId(payment.paymentId);
            setShowPayment(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentData: any) => {
        try {
            const result = await api.processPayment(paymentId, paymentData.paymentMethod, paymentData.paymentDetails);

            if (result.success) {
                clearCart();
                router.push(`/payment/success?orderId=${orderId}&transactionId=${result.transactionId}`);
            } else {
                router.push(`/payment/failed?orderId=${orderId}&error=${encodeURIComponent(result.message)}`);
            }
        } catch (err: any) {
            router.push(`/payment/failed?orderId=${orderId}&error=${encodeURIComponent(err.response?.data?.message || 'Payment processing failed')}`);
        }
    };

    const handlePaymentFailure = (error: string) => {
        setError(error);
        setShowPayment(false);
    };

    const handlePaymentCancel = () => {
        setShowPayment(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-8">
                <div className="max-w-2xl mx-auto text-center py-20">
                    <h1 className="text-3xl font-bold mb-4">Please Login</h1>
                    <p className="text-slate-400 mb-8">You need to be logged in to checkout</p>
                    <button onClick={() => router.push('/auth/login')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">Go to Login</button>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-8">
                <div className="max-w-2xl mx-auto text-center py-20">
                    <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                    <button onClick={() => router.push('/products')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">Browse Products</button>
                </div>
            </div>
        );
    }

    if (showPayment) {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-8">
                <div className="max-w-2xl mx-auto">
                    <DemoPaymentGateway
                        amount={getTotalAmount() + getTotalDeposit()}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                        onCancel={handlePaymentCancel}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Info */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Name:</span>
                                    <span>{user.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Email:</span>
                                    <span>{user.email}</span>
                                </div>
                                {user.phoneNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Phone:</span>
                                        <span>{user.phoneNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {cart.map((item) => {
                                    const days = item.rentalStartDate && item.rentalEndDate
                                        ? Math.ceil((new Date(item.rentalEndDate).getTime() - new Date(item.rentalStartDate).getTime()) / (1000 * 60 * 60 * 24))
                                        : 1;

                                    return (
                                        <div key={item.product.id} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                                            <div className="w-16 h-20 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                                                {item.product.imageUrl && (
                                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{item.product.name}</h3>
                                                <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                                                <p className="text-sm text-slate-400">
                                                    {item.rentalStartDate} to {item.rentalEndDate} ({days} days)
                                                </p>
                                                <p className="text-sm font-medium mt-1">₹{item.product.price * days * item.quantity}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold mb-4">Additional Notes (Optional)</h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any special requests or instructions..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10 sticky top-8">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Rental Amount</span>
                                    <span>₹{getTotalAmount()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Security Deposit</span>
                                    <span>₹{getTotalDeposit()}</span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{getTotalAmount() + getTotalDeposit()}</span>
                                </div>
                                <p className="text-xs text-slate-500">*Deposit refunded after return</p>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>

                            <button
                                onClick={() => router.push('/cart')}
                                className="w-full mt-3 text-slate-400 hover:text-white text-sm"
                            >
                                ← Back to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
