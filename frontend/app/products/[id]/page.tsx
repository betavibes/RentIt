'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api/api';
import { Product } from '@/lib/types';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useCart } from '@/lib/contexts/CartContext';

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [rentalStartDate, setRentalStartDate] = useState('');
    const [rentalEndDate, setRentalEndDate] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id as string);
        }
        // Set default dates (tomorrow to 3 days from now)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const threeDaysLater = new Date();
        threeDaysLater.setDate(threeDaysLater.getDate() + 4);
        setRentalStartDate(tomorrow.toISOString().split('T')[0]);
        setRentalEndDate(threeDaysLater.toISOString().split('T')[0]);
    }, [params.id]);

    const fetchProduct = async (id: string) => {
        try {
            const data = await api.getProductById(id);
            setProduct(data);
            if (data.images && data.images.length > 0) {
                setSelectedImage(data.images[0].url);
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        if (!rentalStartDate || !rentalEndDate) {
            alert('Please select rental dates');
            return;
        }
        addToCart(product, rentalStartDate, rentalEndDate);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Product Not Found</h2>
                    <Link href="/products" className="text-blue-400 hover:underline mt-4 block">
                        Back to Catalog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/products" className="text-slate-400 hover:text-white transition-colors flex items-center">
                        ← Back to Catalog
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] bg-slate-800 rounded-2xl overflow-hidden border border-white/10">
                            {selectedImage ? (
                                <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className="flex space-x-4 overflow-x-auto pb-2">
                                {product.images.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(img.url)}
                                        className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img.url ? 'border-blue-500' : 'border-transparent hover:border-white/30'
                                            }`}
                                    >
                                        <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="text-white">
                        <div className="mb-2">
                            <span className="text-blue-400 font-medium">{product.categoryName}</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

                        <div className="flex items-baseline space-x-4 mb-8">
                            <span className="text-3xl font-bold">₹{product.price}</span>
                            <span className="text-slate-400">/ day</span>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10 space-y-4 mb-8">
                            <div className="flex justify-between border-b border-white/10 pb-4">
                                <span className="text-slate-400">Size</span>
                                <span className="font-medium">{product.size || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-4">
                                <span className="text-slate-400">Color</span>
                                <span className="font-medium">{product.color || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-4">
                                <span className="text-slate-400">Condition</span>
                                <span className={`font-medium capitalize ${product.condition === 'available' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {product.condition}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Security Deposit</span>
                                <span className="font-medium">₹{product.deposit}</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-slate-300 leading-relaxed">
                                {product.description || 'No description available.'}
                            </p>
                        </div>

                        {/* Rental Dates */}
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Select Rental Period</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={rentalStartDate}
                                        onChange={(e) => setRentalStartDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={rentalEndDate}
                                        onChange={(e) => setRentalEndDate(e.target.value)}
                                        min={rentalStartDate || new Date().toISOString().split('T')[0]}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {showSuccess && (
                            <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
                                <span>✓ Added to cart!</span>
                                <button onClick={() => router.push('/cart')} className="text-green-400 hover:text-green-300 font-medium">View Cart →</button>
                            </div>
                        )}

                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.condition !== 'available'}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all"
                            >
                                {product.condition === 'available' ? '🛒 Add to Cart' : 'Currently Unavailable'}
                            </button>
                            <button
                                onClick={() => router.push('/cart')}
                                className="px-6 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-medium transition-all"
                            >
                                View Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
