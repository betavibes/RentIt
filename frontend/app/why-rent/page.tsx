import React from 'react';
import Link from 'next/link';

export default function WhyRentPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative bg-slate-900 pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 mix-blend-multiply" />
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-slate-800/50 to-transparent" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Why buy when you can <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Rent It?</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-300">
                        Save money. Save space. Kids grow fast—expenses shouldn’t.
                    </p>
                </div>
            </div>

            {/* Section 1: The Problem We Solve */}
            <div className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            The Problem We Solve
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Every year children need new dresses for various events.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Events Pile Up</h3>
                            <ul className="space-y-4">
                                {[
                                    'Annual day',
                                    'Fancy dress competition',
                                    'Sports events',
                                    'Cultural programs',
                                    'Photo days',
                                    'Festivals'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center text-slate-700">
                                        <span className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
                            <h3 className="text-xl font-bold text-red-900 mb-4">The Reality</h3>
                            <p className="text-red-800 mb-6">
                                Buying new outfits every time becomes costly and wasteful.
                                And next year? Size changes. Dress becomes useless.
                            </p>
                            <div className="flex justify-center">
                                <span className="text-6xl">💸</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: The Smart Solution */}
            <div className="bg-slate-900 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            The Smart Solution — Rent, Don’t Buy
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Save 70–90% Money',
                                desc: 'Why buy a ₹2000 costume for a one-day event? Rent same for ₹200–₹300.',
                                icon: '💰'
                            },
                            {
                                title: 'No Storage Needed',
                                desc: 'No clothes filling cupboards every year.',
                                icon: '🏠'
                            },
                            {
                                title: 'Variety Every Time',
                                desc: 'Choose different outfits for every event without spending extra.',
                                icon: '✨'
                            },
                            {
                                title: 'Perfect for Growing Kids',
                                desc: 'No tension of size change every year.',
                                icon: '📏'
                            },
                            {
                                title: 'Eco-Friendly',
                                desc: 'Reusing costumes helps reduce textile waste.',
                                icon: '🌱'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section 3: Cost Comparison */}
            <div className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Cost Comparison
                        </h2>
                        <p className="mt-4 text-xl font-medium text-blue-600">
                            “Save smart. Spend less. Live better.”
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Buying Cost */}
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">If You Buy</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                                    <span className="text-slate-600 font-medium">Fancy Dress</span>
                                    <span className="text-slate-900 font-bold">₹1500–₹2500</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                                    <span className="text-slate-600 font-medium">Dance Costume</span>
                                    <span className="text-slate-900 font-bold">₹1000–₹2000</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Sports Wear</span>
                                    <span className="text-slate-900 font-bold">₹800–₹1500</span>
                                </div>
                            </div>
                        </div>

                        {/* Renting Cost */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                BEST VALUE
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">If You Rent with Bharat Costumes</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-blue-200 pb-4">
                                    <span className="text-blue-800 font-medium">Fancy Dress</span>
                                    <span className="text-green-600 font-bold">₹200–₹400</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-blue-200 pb-4">
                                    <span className="text-blue-800 font-medium">Dance Costume</span>
                                    <span className="text-green-600 font-bold">₹150–₹350</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-800 font-medium">Sports Wear</span>
                                    <span className="text-green-600 font-bold">₹100–₹250</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 4: For Parents */}
            <div className="py-16 sm:py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            For Parents
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
                        {[
                            { text: 'Easy size selection', icon: '👕' },
                            { text: 'Cleaned & sanitized', icon: '✨' },
                            { text: 'Delivery & Pickup', icon: '🚚' },
                            { text: 'Secure deposit', icon: '🔒' },
                            { text: 'Trusted by parents', icon: '👨‍👩‍👧‍👦' }
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <p className="font-medium text-slate-900">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section 5: Closing Message */}
            <div className="bg-slate-900 py-16 sm:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-8">
                        “Rent It. Wear It. Return It. Repeat.”
                    </h2>
                    <p className="text-xl text-slate-300 mb-10">
                        Simple. Affordable. Stress-free.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/products"
                            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-all shadow-lg hover:shadow-blue-500/30"
                        >
                            Start Renting
                        </Link>
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center px-8 py-3 border border-slate-600 text-base font-medium rounded-md text-slate-300 bg-transparent hover:bg-slate-800 md:text-lg transition-all"
                        >
                            Join Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
