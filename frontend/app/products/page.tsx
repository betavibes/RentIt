'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api/api';
import { Product, Category, Occasion, AgeGroup } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import ProductFilters from '@/components/ProductFilters';

export const dynamic = 'force-dynamic';

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [occasions, setOccasions] = useState<Occasion[]>([]);
    const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter state from URL
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.get('categories')?.split(',').filter(Boolean) || []
    );
    const [selectedOccasions, setSelectedOccasions] = useState<string[]>(
        searchParams.get('occasions')?.split(',').filter(Boolean) || []
    );
    const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>(
        searchParams.get('ageGroups')?.split(',').filter(Boolean) || []
    );
    const [minPrice, setMinPrice] = useState(Number(searchParams.get('minPrice')) || 0);
    const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 10000);
    const [selectedSizes, setSelectedSizes] = useState<string[]>(
        searchParams.get('sizes')?.split(',').filter(Boolean) || []
    );
    const [selectedColors, setSelectedColors] = useState<string[]>(
        searchParams.get('colors')?.split(',').filter(Boolean) || []
    );
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
        updateURL();
    }, [search, selectedCategories, selectedOccasions, selectedAgeGroups, minPrice, maxPrice, selectedSizes, selectedColors, sort]);

    const fetchCategories = async () => {
        try {
            const [cats, occs, ages] = await Promise.all([
                api.getCategories(),
                api.getOccasions(),
                api.getAgeGroups()
            ]);
            setCategories(cats);
            setOccasions(occs);
            setAgeGroups(ages);
        } catch (error) {
            console.error('Failed to fetch filter data:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const filters: any = { status: 'active' };
            if (search) filters.search = search;
            if (selectedCategories.length > 0) filters.category = selectedCategories[0];
            if (selectedOccasions.length > 0) filters.occasion = selectedOccasions[0];
            if (selectedAgeGroups.length > 0) filters.ageGroup = selectedAgeGroups[0];
            if (minPrice > 0) filters.minPrice = minPrice;
            if (maxPrice < 10000) filters.maxPrice = maxPrice;
            if (selectedSizes.length > 0) filters.size = selectedSizes[0];
            if (selectedColors.length > 0) filters.color = selectedColors[0];
            if (sort) filters.sort = sort;

            const prods = await api.getProducts(filters);
            setProducts(prods);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateURL = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
        if (selectedOccasions.length > 0) params.set('occasions', selectedOccasions.join(','));
        if (selectedAgeGroups.length > 0) params.set('ageGroups', selectedAgeGroups.join(','));
        if (minPrice > 0) params.set('minPrice', minPrice.toString());
        if (maxPrice < 10000) params.set('maxPrice', maxPrice.toString());
        if (selectedSizes.length > 0) params.set('sizes', selectedSizes.join(','));
        if (selectedColors.length > 0) params.set('colors', selectedColors.join(','));
        if (sort) params.set('sort', sort);

        const queryString = params.toString();
        router.push(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
    };

    const handleCategoryChange = (slug: string) => {
        setSelectedCategories(prev =>
            prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
        );
    };

    const handleOccasionChange = (slug: string) => {
        setSelectedOccasions(prev =>
            prev.includes(slug) ? prev.filter(o => o !== slug) : [...prev, slug]
        );
    };

    const handleAgeGroupChange = (slug: string) => {
        setSelectedAgeGroups(prev =>
            prev.includes(slug) ? prev.filter(a => a !== slug) : [...prev, slug]
        );
    };

    const handleSizeChange = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const handleColorChange = (color: string) => {
        setSelectedColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedCategories([]);
        setSelectedOccasions([]);
        setSelectedAgeGroups([]);
        setMinPrice(0);
        setMaxPrice(10000);
        setSelectedSizes([]);
        setSelectedColors([]);
        setSort('newest');
    };

    const activeFiltersCount = selectedCategories.length + selectedOccasions.length + selectedAgeGroups.length + selectedSizes.length + selectedColors.length +
        (minPrice > 0 ? 1 : 0) + (maxPrice < 10000 ? 1 : 0) + (search ? 1 : 0);

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with Tagline and Promotions */}
                <div className="mb-12">
                    {/* Beautiful Tagline */}
                    <div className="text-center mb-8">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                            Rent Costumes for Every Event
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-light">
                            Affordable & Hassle-Free! ✨
                        </p>
                    </div>

                    {/* Scrolling Promotional Banner */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-pink-500/20 border-y border-orange-500/30 py-3 mb-8">
                        <div className="flex animate-marquee whitespace-nowrap">
                            <div className="flex items-center gap-8 text-base font-medium">
                                <span className="flex items-center gap-2 text-orange-300">
                                    <span className="text-xl">🔥</span>
                                    <span>First-Time User: Get 20% OFF – Code: <span className="font-mono bg-orange-500/30 px-2 py-1 rounded">WELCOME20</span></span>
                                </span>
                                <span className="text-slate-500">•</span>
                                <span className="flex items-center gap-2 text-purple-300">
                                    <span className="text-xl">💥</span>
                                    <span>School Annual Day Special: Flat 15% OFF on all theme costumes</span>
                                </span>
                                <span className="text-slate-500">•</span>
                                <span className="flex items-center gap-2 text-pink-300">
                                    <span className="text-xl">🎉</span>
                                    <span>Festive Offer: Rent 2 costumes & get 1 FREE!</span>
                                </span>
                                <span className="text-slate-500">•</span>
                                {/* Duplicate for seamless loop */}
                                <span className="flex items-center gap-2 text-orange-300">
                                    <span className="text-xl">🔥</span>
                                    <span>First-Time User: Get 20% OFF – Code: <span className="font-mono bg-orange-500/30 px-2 py-1 rounded">WELCOME20</span></span>
                                </span>
                                <span className="text-slate-500">•</span>
                                <span className="flex items-center gap-2 text-purple-300">
                                    <span className="text-xl">💥</span>
                                    <span>School Annual Day Special: Flat 15% OFF on all theme costumes</span>
                                </span>
                                <span className="text-slate-500">•</span>
                                <span className="flex items-center gap-2 text-pink-300">
                                    <span className="text-xl">🎉</span>
                                    <span>Festive Offer: Rent 2 costumes & get 1 FREE!</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <SearchBar onSearch={setSearch} initialValue={search} />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="sticky top-24">
                            <ProductFilters
                                categories={categories}
                                occasions={occasions}
                                ageGroups={ageGroups}
                                selectedCategories={selectedCategories}
                                selectedOccasions={selectedOccasions}
                                selectedAgeGroups={selectedAgeGroups}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                selectedSizes={selectedSizes}
                                selectedColors={selectedColors}
                                onCategoryChange={handleCategoryChange}
                                onOccasionChange={handleOccasionChange}
                                onAgeGroupChange={handleAgeGroupChange}
                                onPriceChange={(min, max) => {
                                    setMinPrice(min);
                                    setMaxPrice(max);
                                }}
                                onSizeChange={handleSizeChange}
                                onColorChange={handleColorChange}
                                onClearFilters={handleClearFilters}
                            />
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-slate-400">
                                    Showing {products.length} product{products.length !== 1 ? 's' : ''}
                                    {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} applied)`}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-slate-400">Sort by:</label>
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="popular">Popular</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Filters Chips */}
                        {activeFiltersCount > 0 && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {search && (
                                    <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                                        Search: "{search}"
                                        <button onClick={() => setSearch('')} className="hover:text-white">×</button>
                                    </span>
                                )}
                                {selectedCategories.map(cat => (
                                    <span key={cat} className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                                        {categories.find(c => c.slug === cat)?.name}
                                        <button onClick={() => handleCategoryChange(cat)} className="hover:text-white">×</button>
                                    </span>
                                ))}
                                {selectedOccasions.map(occ => (
                                    <span key={occ} className="inline-flex items-center gap-1 bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm">
                                        {occasions.find(o => o.slug === occ)?.name}
                                        <button onClick={() => handleOccasionChange(occ)} className="hover:text-white">×</button>
                                    </span>
                                ))}
                                {selectedAgeGroups.map(age => (
                                    <span key={age} className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                                        {ageGroups.find(a => a.slug === age)?.name}
                                        <button onClick={() => handleAgeGroupChange(age)} className="hover:text-white">×</button>
                                    </span>
                                ))}
                                {selectedSizes.map(size => (
                                    <span key={size} className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                                        Size: {size}
                                        <button onClick={() => handleSizeChange(size)} className="hover:text-white">×</button>
                                    </span>
                                ))}
                                {selectedColors.map(color => (
                                    <span key={color} className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">
                                        Color: {color}
                                        <button onClick={() => handleColorChange(color)} className="hover:text-white">×</button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Products Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} className="bg-slate-800 rounded-xl h-96 animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <Link href={`/products/${product.id}`} key={product.id} className="group">
                                        <div className="bg-slate-800 rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/20 h-full flex flex-col">
                                            <div className="aspect-[3/4] bg-slate-700 relative overflow-hidden">
                                                {product.imageUrl ? (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                        No Image
                                                    </div>
                                                )}
                                                {product.condition !== 'available' && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                        {product.condition.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col">
                                                <div className="text-xs text-blue-400 font-medium mb-1">{product.categoryName}</div>
                                                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{product.name}</h3>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="text-xl font-bold text-white">₹{product.price}</span>
                                                    <span className="text-sm text-slate-400">/ day</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-slate-400 text-lg mb-4">No products found matching your filters.</p>
                                <button
                                    onClick={handleClearFilters}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
