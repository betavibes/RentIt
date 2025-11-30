'use client';

import React from 'react';
import Link from 'next/link';

export default function SchoolsEventsPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative bg-slate-900 pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 mix-blend-multiply" />
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-slate-800/50 to-transparent" />
                    {/* Decorative blobs */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-yellow-500/10 blur-3xl animate-pulse-slow"></div>
                    <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fadeIn">
                        Make every event special— <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">without special budgets.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-300 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        Premium costumes for schools, annual days, and cultural events at unbeatable prices.
                    </p>
                </div>
            </div>

            {/* Section 1: Why Schools Choose Bharat Costumes */}
            <div className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Why Schools Choose Bharat Costumes
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Affordable Bulk Rental', desc: 'Special pricing for Annual Day & Cultural Events.', icon: '💰' },
                            { title: '100+ Themes', desc: 'Freedom Fighters, Indian States, Professions, Dance, Mythology & more.', icon: '🎭' },
                            { title: 'All Sizes Available', desc: 'From Nursery to Class 12, we have sizes for everyone.', icon: '📏' },
                            { title: 'Custom Packages', desc: 'Tailored solutions to meet your specific school needs.', icon: '📦' },
                            { title: 'Delivery & Return', desc: 'Hassle-free logistics support for large orders.', icon: '🚚' },
                            { title: 'Dedicated Coordinator', desc: 'One point of contact for seamless coordination.', icon: '👨‍💼' },
                        ].map((item, index) => (
                            <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section 2: School Packages */}
            <div className="py-16 sm:py-24 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            School Packages
                        </h2>
                        <p className="mt-4 text-slate-400">Choose the plan that fits your event scale.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Basic Package */}
                        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-blue-500 transition-colors relative">
                            <h3 className="text-2xl font-bold text-white mb-4">Basic School Package</h3>
                            <ul className="space-y-4 mb-8">
                                {[
                                    '50 costumes',
                                    '2 day rental',
                                    'Pickup & delivery',
                                    'High hygiene & quality'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center text-slate-300">
                                        <svg className="h-5 w-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                                Select Basic
                            </button>
                        </div>

                        {/* Premium Package */}
                        <div className="bg-gradient-to-b from-blue-900 to-slate-900 rounded-2xl p-8 border-2 border-blue-500 transform md:-translate-y-4 shadow-2xl relative">
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                POPULAR
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Premium School Package</h3>
                            <ul className="space-y-4 mb-8">
                                {[
                                    '100–200 costumes',
                                    'Dedicated event manager',
                                    'Size trial option',
                                    'Damage protection included'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center text-slate-200">
                                        <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30">
                                Select Premium
                            </button>
                        </div>

                        {/* Elite Package */}
                        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-yellow-500 transition-colors relative">
                            <h3 className="text-2xl font-bold text-white mb-4">Elite School Package</h3>
                            <ul className="space-y-4 mb-8">
                                {[
                                    '300+ costumes',
                                    'Custom theme creation',
                                    'Backstage support',
                                    'Stage accessories included'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center text-slate-300">
                                        <svg className="h-5 w-5 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                                Select Elite
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Message for Principals & Teachers */}
            <div className="py-16 sm:py-24 bg-yellow-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-6xl mb-6">🎓</div>
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-6">
                        Message for Principals & Teachers
                    </h2>
                    <p className="text-xl text-slate-700 leading-relaxed">
                        “Costumes play a big role in stage performance. Bharat Costumes helps your students look their best—without the parents spending thousands.”
                    </p>
                </div>
            </div>

            {/* Section 4: CTA */}
            <div className="py-16 sm:py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-8">
                        “Partner with Bharat Costumes for your next school event.”
                    </h2>
                    <div className="flex justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
                        >
                            Book a School Demo
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
