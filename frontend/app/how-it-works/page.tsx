'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HowItWorksPage() {
    const [retailPrice, setRetailPrice] = useState<number | ''>('');
    const [savings, setSavings] = useState<number | null>(null);

    const calculateSavings = (price: number) => {
        // Assuming rental price is approx 15% of retail price
        const rentalPrice = Math.round(price * 0.15);
        const savedAmount = price - rentalPrice;
        setSavings(savedAmount);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setRetailPrice('');
            setSavings(null);
        } else {
            const numValue = parseInt(value);
            if (!isNaN(numValue)) {
                setRetailPrice(numValue);
                calculateSavings(numValue);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative bg-slate-900 pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 mix-blend-multiply" />
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-slate-800/50 to-transparent" />
                    {/* Decorative blobs */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/30 blur-3xl animate-pulse-slow"></div>
                    <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fadeIn">
                        Simple steps. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Big savings.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-300 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        Rent premium outfits for your kids without breaking the bank.
                    </p>
                </div>
            </div>

            {/* Section 1: Step-by-Step Guide */}
            <div className="py-16 sm:py-24 -mt-10 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-6">
                                👗
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">STEP 1: Browse Collections</h3>
                            <p className="text-slate-600">
                                Choose from School costumes, Fancy Dress, Annual Day outfits, Festival Look, Dance Wear, Sports Wear & more.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mb-6">
                                📏
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">STEP 2: Select Size & Date</h3>
                            <p className="text-slate-600">
                                Pick your child’s size and rental date.
                                <span className="block mt-2 text-sm text-blue-600 font-medium">(We help you with size chart also)</span>
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mb-6">
                                💳
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">STEP 3: Book & Pay</h3>
                            <p className="text-slate-600">
                                Secure checkout, online payment or COD (optional).
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl mb-6">
                                🚚
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">STEP 4: Home Delivery</h3>
                            <p className="text-slate-600">
                                Get costume delivered to your doorstep or pick from store (if available).
                            </p>
                        </div>

                        {/* Step 5 */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-3xl mb-6">
                                ✨
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">STEP 5: Wear & Enjoy!</h3>
                            <p className="text-slate-600">
                                Perfect fit, fully cleaned, ready to shine.
                            </p>
                        </div>

                        {/* Step 6 */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-3xl mb-6">
                                🔄
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">STEP 6: Easy Return Pickup</h3>
                            <p className="text-slate-600">
                                We come back and pick the outfit after the event.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: What You Get */}
            <div className="bg-slate-900 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            What You Get
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { text: 'Free size assistance', icon: '📏' },
                            { text: 'Sanitized costumes', icon: '✨' },
                            { text: 'Damage protection option', icon: '🛡️' },
                            { text: 'On-time delivery guarantee', icon: '⏱️' }
                        ].map((item, index) => (
                            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors text-center group">
                                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                                <h3 className="text-lg font-bold text-white">{item.text}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-6">
                        “Rent in minutes. Look great instantly.”
                    </h2>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link
                            href="/products"
                            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 md:text-lg transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
                        >
                            Start Renting Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* PRICING & PLANS Section */}
            <div className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            PRICING & PLANS
                        </h2>
                        <p className="mt-4 text-xl text-slate-600">
                            “Clear pricing. No hidden surprises.”
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        {/* Section 1: Daily Rentals */}
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3 text-xl">📅</span>
                                Daily Rentals
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { item: 'Fancy Dress Costume', price: '₹200 to ₹400' },
                                    { item: 'Annual Day Costume', price: '₹150 to ₹350' },
                                    { item: 'Dance Outfits', price: '₹150 to ₹350' },
                                    { item: 'Festival Outfits', price: '₹200 to ₹400' },
                                    { item: 'Sports Uniforms', price: '₹100 to ₹200' }
                                ].map((row, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-slate-200 pb-3 last:border-0">
                                        <span className="text-slate-700 font-medium">{row.item}</span>
                                        <span className="text-slate-900 font-bold">{row.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 2: Weekly Rentals */}
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3 text-xl">🗓️</span>
                                Weekly Rentals
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { item: 'School Event Package', price: '₹400 to ₹700' },
                                    { item: 'Dance Practice Costumes', price: '₹300 to ₹500' }
                                ].map((row, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-slate-200 pb-3 last:border-0">
                                        <span className="text-slate-700 font-medium">{row.item}</span>
                                        <span className="text-slate-900 font-bold">{row.price}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Section 3: Security Deposit */}
                            <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
                                <h4 className="text-lg font-bold text-blue-900 mb-3">Security Deposit (Refundable)</h4>
                                <ul className="space-y-2 text-blue-800 text-sm">
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                        Usually 50% of rental price
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                        Returned within 24–48 hrs
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                        Fully refundable if outfit returned properly
                                    </li>
                                </ul>
                                <p className="mt-4 text-center font-medium text-blue-700 italic">
                                    “Simple rules. Full transparency.”
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Section 4: Damage Policy */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Damage Policy</h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
                                        ✓
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-slate-900">Minor wear & tear</h4>
                                        <p className="text-green-600 font-medium">No charges</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-xl">
                                        ⚠️
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-slate-900">Major damage or missing part</h4>
                                        <p className="text-yellow-600 font-medium">Small deduction from deposit</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl">
                                        ❌
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-slate-900">Lost item</h4>
                                        <p className="text-red-600 font-medium">Replacement cost</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Savings Calculator */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl">
                            <h3 className="text-2xl font-bold mb-2">Savings Calculator</h3>
                            <p className="text-slate-400 mb-8">See how much you save by renting.</p>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="retail-price" className="block text-sm font-medium text-slate-300 mb-2">
                                        Enter Retail Price (₹)
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-slate-500 sm:text-sm">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="retail-price"
                                            id="retail-price"
                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-lg border-slate-600 rounded-md bg-slate-700 text-white placeholder-slate-400 py-3"
                                            placeholder="2000"
                                            value={retailPrice}
                                            onChange={handlePriceChange}
                                        />
                                    </div>
                                </div>

                                {savings !== null && (
                                    <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10 animate-fadeIn">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-300">Estimated Rental:</span>
                                            <span className="text-white font-bold">₹{Math.round((retailPrice as number) * 0.15)}</span>
                                        </div>
                                        <div className="h-px bg-white/10 my-3"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-green-400 font-bold text-lg">You Save:</span>
                                            <span className="text-green-400 font-bold text-2xl">₹{savings}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-4 text-center">
                                            *Estimates based on average rental rates.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
