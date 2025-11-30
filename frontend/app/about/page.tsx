'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative bg-slate-900 pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 mix-blend-multiply" />
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-slate-800/50 to-transparent" />
                    {/* Decorative blobs */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pink-500/30 blur-3xl animate-pulse-slow"></div>
                    <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fadeIn">
                        Making smart shopping <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">accessible for every Indian family.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-300 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        Bharat Costumes is a modern rental platform designed for parents, students, and schools who want affordable outfits for events, without waste and without overspending.
                    </p>
                </div>
            </div>

            {/* Section 2: Our Mission */}
            <div className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Our Mission
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Reduce Waste', desc: 'Reduce unnecessary textile waste', icon: '🌱' },
                            { title: 'Accessible for All', desc: 'Make renting accessible for all', icon: '🤝' },
                            { title: 'Help Kids Shine', desc: 'Help kids shine in every school event', icon: '✨' },
                            { title: 'Affordability', desc: 'Promote affordability & convenience', icon: '💰' },
                        ].map((item, index) => (
                            <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section 3: What We Stand For */}
            <div className="py-16 sm:py-24 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            What We Stand For
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { title: 'Transparency', icon: '🔍' },
                            { title: 'Hygiene', icon: '🧼' },
                            { title: 'Affordability', icon: '💸' },
                            { title: 'Professional service', icon: '👔' },
                        ].map((item, index) => (
                            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-pink-500/50 transition-colors">
                                <div className="text-5xl mb-6">{item.icon}</div>
                                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-16 sm:py-24 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Real parents. Real savings. Real smiles.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 relative">
                            <div className="absolute -top-4 -left-4 text-6xl text-purple-200">“</div>
                            <p className="text-slate-600 mb-6 relative z-10 italic">
                                For every fancy-dress I used to spend ₹1500–2000. With Bharat Costumes I rented in ₹250 only. Perfect fit, timely delivery!
                            </p>
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">P</div>
                                <div className="ml-3">
                                    <p className="text-sm font-bold text-slate-900">Mrs. Priya</p>
                                    <p className="text-xs text-slate-500">Mother of Class 2 student</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 relative">
                            <div className="absolute -top-4 -left-4 text-6xl text-purple-200">“</div>
                            <p className="text-slate-600 mb-6 relative z-10 italic">
                                Kids grow fast. Renting is the best option. Huge savings.
                            </p>
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">R</div>
                                <div className="ml-3">
                                    <p className="text-sm font-bold text-slate-900">Mr. Rakesh</p>
                                    <p className="text-xs text-slate-500">Parent of Twins</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 relative">
                            <div className="absolute -top-4 -left-4 text-6xl text-purple-200">“</div>
                            <p className="text-slate-600 mb-6 relative z-10 italic">
                                For Annual Day we needed 200 costumes. Bharat Costumes delivered on time with perfect quality.
                            </p>
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">S</div>
                                <div className="ml-3">
                                    <p className="text-sm font-bold text-slate-900">Sunrise Public School</p>
                                    <p className="text-xs text-slate-500">School Partner</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Gallery Placeholder */}
            <div className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Moments of Joy
                        </h2>
                        <p className="mt-4 text-slate-600">Happy kids, happy parents.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Using placeholders as I don't have real images yet */}
                        <div className="aspect-square bg-slate-200 rounded-xl animate-pulse flex items-center justify-center text-slate-400">Event Photo 1</div>
                        <div className="aspect-square bg-slate-200 rounded-xl animate-pulse flex items-center justify-center text-slate-400">Event Photo 2</div>
                        <div className="aspect-square bg-slate-200 rounded-xl animate-pulse flex items-center justify-center text-slate-400">Event Photo 3</div>
                        <div className="aspect-square bg-slate-200 rounded-xl animate-pulse flex items-center justify-center text-slate-400">Event Photo 4</div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-16 sm:py-24 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            FAQ
                        </h2>
                        <p className="mt-4 text-xl text-slate-600">
                            “All your doubts answered—quick and simple.”
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: 'Are the costumes clean and safe?', a: 'Yes! Every costume is steam-cleaned and sanitized before delivery.' },
                            { q: 'What if the size doesn’t fit?', a: 'We provide free exchange (subject to availability).' },
                            { q: 'Do I need to wash before returning?', a: 'No. Just return as it is.' },
                            { q: 'What if the dress gets dirty?', a: 'Normal use is fine. No extra charges.' },
                            { q: 'What is the security deposit for?', a: 'To cover unexpected damage. Fully refundable.' },
                            { q: 'How quickly will I receive my refund?', a: 'Within 24–48 hours.' },
                            { q: 'Do you provide doorstep delivery?', a: 'Yes, available in selected areas.' },
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                                >
                                    <span className="font-bold text-slate-900">{faq.q}</span>
                                    <span className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-4 text-slate-600 animate-fadeIn">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
