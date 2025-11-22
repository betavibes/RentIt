'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, getTotalAmount, clearCart } = useCart();
    const router = useRouter();
    const [rentalDates, setRentalDates] = useState<{ [key: string]: { start: string; end: string } }>({});

    const calculateDays = (startDate: string, endDate: string) => {
        if (!startDate || !endDate) return 1;
        return Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
    };

    const calculateItemTotal = (item: any) => {
        const dates = rentalDates[item.product.id] || { start: item.rentalStartDate, end: item.rentalEndDate };
        const days = calculateDays(dates.start, dates.end);
        return item.product.price * days * item.quantity;
    };

    const getTotalDeposit = () => {
        return cart.reduce((sum, item) => sum + (item.product.deposit * item.quantity), 0);
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        router.push('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-8">
                <div className="max-w-4xl mx-auto text-center py-20">
                    <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                    <p className="text-slate-400 mb-8">Add some products to get started!</p>
                    <Link
                        href="/products"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Shopping Cart</h1>
                    <button
                        onClick={clearCart}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => {
                            const dates = rentalDates[item.product.id] || { start: item.rentalStartDate || '', end: item.rentalEndDate || '' };
                            const days = calculateDays(dates.start, dates.end);

                            return (
                                <div key={item.product.id} className="bg-slate-800 rounded-xl p-6 border border-white/10">
                                    <div className="flex gap-4">
                                        <div className="w-24 h-32 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.product.imageUrl ? (
                                                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No Image</div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                                                    <p className="text-sm text-slate-400">{item.product.categoryName}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-xs text-slate-400 mb-1">Start Date</label>
                                                    <input
                                                        type="date"
                                                        value={dates.start}
                                                        onChange={(e) => setRentalDates({ ...rentalDates, [item.product.id]: { ...dates, start: e.target.value } })}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                                                        min={new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-slate-400 mb-1">End Date</label>
                                                    <input
                                                        type="date"
                                                        value={dates.end}
                                                        onChange={(e) => setRentalDates({ ...rentalDates, [item.product.id]: { ...dates, end: e.target.value } })}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                                                        min={dates.start || new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-12 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-slate-400">₹{item.product.price}/day × {days} days</div>
                                                    <div className="text-lg font-bold">₹{calculateItemTotal(item)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10 sticky top-8">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Subtotal</span>
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
                                <p className="text-xs text-slate-500">*Deposit will be refunded after return</p>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
                            >
                                Proceed to Checkout
                            </button>

                            <Link
                                href="/products"
                                className="block text-center text-blue-400 hover:text-blue-300 mt-4 text-sm"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
