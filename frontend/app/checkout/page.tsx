'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/api';

export default function CheckoutPage() {
    const { cart, clearCart, getTotalAmount } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notes, setNotes] = useState('');

    // Shipping Address State
    const [shippingAddress, setShippingAddress] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    // Payment Method State
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

    useEffect(() => {
        if (user) {
            setShippingAddress(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phoneNumber || ''
            }));

            // Fetch full profile to get address details
            api.getProfile().then(profile => {
                if (profile) {
                    setShippingAddress(prev => ({
                        ...prev,
                        address: profile.address || '',
                        city: profile.city || '',
                        state: profile.state || '',
                        zip: profile.postalCode || ''
                    }));
                }
            }).catch(err => console.error('Failed to fetch profile:', err));
        }
    }, [user]);

    const getTotalDeposit = () => {
        return cart.reduce((sum, item) => sum + (item.product.deposit * item.quantity), 0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
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

        // Basic Validation
        if (!shippingAddress.name || !shippingAddress.email || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip) {
            setError('Please fill in all shipping details');
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

            // Combine notes with shipping address for now since backend doesn't have address columns
            const fullNotes = `
Shipping Address:
${shippingAddress.name}
${shippingAddress.address}
${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}
Phone: ${shippingAddress.phone}
Email: ${shippingAddress.email}

User Notes:
${notes}
            `.trim();

            const orderData = {
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                })),
                rentalStartDate: firstItem.rentalStartDate,
                rentalEndDate: firstItem.rentalEndDate,
                notes: fullNotes,
                paymentMethod: paymentMethod
            };

            const order = await api.createOrder(orderData);
            clearCart();
            router.push(`/orders/success?orderId=${order.id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create order');
            setLoading(false);
        }
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

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Shipping Address */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={shippingAddress.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingAddress.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingAddress.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-slate-400 mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={shippingAddress.address}
                                        onChange={handleInputChange}
                                        placeholder="Street address, Apartment, Suite, etc."
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingAddress.city}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={shippingAddress.state}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">ZIP / Postal Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={shippingAddress.zip}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-600"
                                    />
                                    <div className="ml-3">
                                        <span className="block font-medium">Cash on Delivery (COD)</span>
                                        <span className="block text-sm text-slate-400">Pay when you receive your items</span>
                                    </div>
                                </label>

                                <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={() => setPaymentMethod('online')}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-600"
                                        disabled
                                    />
                                    <div className="ml-3 opacity-50">
                                        <span className="block font-medium">Online Payment (Coming Soon)</span>
                                        <span className="block text-sm text-slate-400">Credit/Debit Card, UPI, Netbanking</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-bold mb-4">Additional Notes (Optional)</h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any special requests or instructions..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800 rounded-xl p-6 border border-white/10 sticky top-8">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                            {/* Mini Cart Items */}
                            <div className="mb-6 space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.product.id} className="flex gap-3 text-sm">
                                        <div className="w-12 h-16 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                                            {item.product.imageUrl && (
                                                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium line-clamp-1">{item.product.name}</p>
                                            <p className="text-slate-400">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-medium">
                                            ₹{item.product.price * item.quantity * (item.rentalStartDate && item.rentalEndDate ? Math.ceil((new Date(item.rentalEndDate).getTime() - new Date(item.rentalStartDate).getTime()) / (1000 * 60 * 60 * 24)) : 1)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6 border-t border-white/10 pt-4">
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
