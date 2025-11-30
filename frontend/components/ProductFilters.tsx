'use client';

import React from 'react';
import { Category, Occasion, AgeGroup } from '@/lib/types';

interface ProductFiltersProps {
    categories: Category[];
    occasions: Occasion[];
    ageGroups: AgeGroup[];
    selectedCategories: string[];
    selectedOccasions: string[];
    selectedAgeGroups: string[];
    minPrice: number;
    maxPrice: number;
    selectedSizes: string[];
    selectedColors: string[];
    onCategoryChange: (slug: string) => void;
    onOccasionChange: (slug: string) => void;
    onAgeGroupChange: (slug: string) => void;
    onPriceChange: (min: number, max: number) => void;
    onSizeChange: (size: string) => void;
    onColorChange: (color: string) => void;
    onClearFilters: () => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
    { name: 'Red', value: 'red', hex: '#EF4444' },
    { name: 'Blue', value: 'blue', hex: '#3B82F6' },
    { name: 'Green', value: 'green', hex: '#10B981' },
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Pink', value: 'pink', hex: '#EC4899' },
    { name: 'Purple', value: 'purple', hex: '#A855F7' },
    { name: 'Yellow', value: 'yellow', hex: '#EAB308' },
];

export default function ProductFilters({
    categories,
    occasions,
    ageGroups,
    selectedCategories,
    selectedOccasions,
    selectedAgeGroups,
    minPrice,
    maxPrice,
    selectedSizes,
    selectedColors,
    onCategoryChange,
    onOccasionChange,
    onAgeGroupChange,
    onPriceChange,
    onSizeChange,
    onColorChange,
    onClearFilters
}: ProductFiltersProps) {
    const hasActiveFilters = selectedCategories.length > 0 || selectedOccasions.length > 0 || selectedAgeGroups.length > 0 || selectedSizes.length > 0 ||
        selectedColors.length > 0 || minPrice > 0 || maxPrice < 10000;

    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-blue-400 hover:text-blue-300"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Categories */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Categories</h4>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label key={category.id} className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.slug)}
                                onChange={() => onCategoryChange(category.slug)}
                                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="ml-2 text-sm text-slate-400 group-hover:text-white">
                                {category.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Occasions */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Occasions</h4>
                <div className="space-y-2">
                    {occasions.map((occasion) => (
                        <label key={occasion.id} className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedOccasions.includes(occasion.slug)}
                                onChange={() => onOccasionChange(occasion.slug)}
                                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="ml-2 text-sm text-slate-400 group-hover:text-white">
                                {occasion.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Age Groups */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Age Groups</h4>
                <div className="space-y-2">
                    {ageGroups.map((ageGroup) => (
                        <label key={ageGroup.id} className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedAgeGroups.includes(ageGroup.slug)}
                                onChange={() => onAgeGroupChange(ageGroup.slug)}
                                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="ml-2 text-sm text-slate-400 group-hover:text-white">
                                {ageGroup.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Price Range</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
                            placeholder="Min"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-slate-400">-</span>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
                            placeholder="Max"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="text-xs text-slate-500">
                        ₹{minPrice} - ₹{maxPrice}
                    </div>
                </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                        <button
                            key={size}
                            onClick={() => onSizeChange(size)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedSizes.includes(size)
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Color</h4>
                <div className="flex flex-wrap gap-3">
                    {COLORS.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => onColorChange(color.value)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColors.includes(color.value)
                                ? 'border-blue-500 ring-2 ring-blue-500/50'
                                : 'border-slate-600 hover:border-slate-400'
                                }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        >
                            {selectedColors.includes(color.value) && (
                                <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
