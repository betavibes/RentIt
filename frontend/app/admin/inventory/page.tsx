'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api/api';
import { Product, Category, Occasion, AgeGroup } from '@/lib/types';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminInventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [occasions, setOccasions] = useState<Occasion[]>([]);
    const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isOccasionModalOpen, setIsOccasionModalOpen] = useState(false);
    const [isAgeGroupModalOpen, setIsAgeGroupModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        deposit: 0,
        categoryId: '',
        occasionId: '',
        ageGroupId: '',
        size: '',
        color: '',
        condition: 'available',
        status: 'active',
    });
    const [images, setImages] = useState<Array<{ url: string, orderNumber: number, file?: File }>>([]);
    const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '', imageUrl: '' });
    const [occasionForm, setOccasionForm] = useState({ name: '', slug: '', description: '' });
    const [ageGroupForm, setAgeGroupForm] = useState({ name: '', slug: '', description: '' });
    const [editProductId, setEditProductId] = useState<string>('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        deposit: 0,
        categoryId: '',
        occasionId: '',
        ageGroupId: '',
        size: '',
        color: '',
        condition: 'available',
        status: 'active',
    });
    const [editImages, setEditImages] = useState<Array<{ url: string, orderNumber: number, file?: File }>>([]);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [cats, occs, ages, prods] = await Promise.all([
                api.getCategories(),
                api.getOccasions(),
                api.getAgeGroups(),
                api.getProducts()
            ]);
            setCategories(cats);
            setOccasions(occs);
            setAgeGroups(ages);
            setProducts(prods);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Upload images first if there are any files
            let imageUrls: string[] = [];
            const filesToUpload = images.filter(img => img.file).map(img => img.file!);

            if (filesToUpload.length > 0) {
                imageUrls = await api.uploadProductImages(filesToUpload);
            }

            // Create product with uploaded image URLs and order numbers
            const imageData = imageUrls.map((url, index) => ({
                url,
                orderNumber: index + 1
            }));

            await api.createProduct({
                ...formData,
                images: imageUrls
            } as Partial<Product> & { images: string[] });

            setIsModalOpen(false);
            fetchData();
            setFormData({
                name: '',
                description: '',
                price: 0,
                deposit: 0,
                categoryId: '',
                occasionId: '',
                ageGroupId: '',
                size: '',
                color: '',
                condition: 'available',
            });
            setImages([]);
        } catch (error) {
            console.error('Failed to create product:', error);
            alert('Failed to create product');
        }
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createCategory(categoryForm);
            setIsCategoryModalOpen(false);
            fetchData();
            setCategoryForm({ name: '', slug: '', description: '', imageUrl: '' });
        } catch (error) {
            console.error('Failed to create category:', error);
            alert('Failed to create category');
        }
    };

    const handleOccasionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createOccasion(occasionForm);
            setIsOccasionModalOpen(false);
            fetchData();
            setOccasionForm({ name: '', slug: '', description: '' });
        } catch (error) {
            console.error('Failed to create occasion:', error);
            alert('Failed to create occasion');
        }
    };

    const handleAgeGroupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createAgeGroup(ageGroupForm);
            setIsAgeGroupModalOpen(false);
            fetchData();
            setAgeGroupForm({ name: '', slug: '', description: '' });
        } catch (error) {
            console.error('Failed to create age group:', error);
            alert('Failed to create age group');
        }
    };

    const handleStatusUpdate = async (id: string, condition: string) => {
        try {
            await api.updateProductStatus(id, condition);
            fetchData();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.deleteProduct(id);
                fetchData();
            } catch (error) {
                console.error('Failed to delete product:', error);
                alert('Failed to delete product');
            }
        }
    };

    // Open edit modal with product data
    const handleEdit = (product: Product) => {
        setEditProductId(product.id);
        setEditFormData({
            name: product.name,
            description: product.description ?? '',
            price: product.price,
            deposit: product.deposit,
            categoryId: product.categoryId,
            occasionId: product.occasionId ?? '',
            ageGroupId: product.ageGroupId ?? '',
            size: product.size ?? '',
            color: product.color ?? '',
            status: product.status ?? 'active',
        });
        // Load existing images
        const existingImages = product.images?.map((img, index) => ({
            url: img.url,
            orderNumber: index + 1
        })) ?? [];
        setEditImages(existingImages);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Upload new images if there are any files
            let imageUrls: string[] = [];
            const filesToUpload = editImages.filter(img => img.file).map(img => img.file!);

            if (filesToUpload.length > 0) {
                const uploadedUrls = await api.uploadProductImages(filesToUpload);
                // Combine existing URLs (without files) and newly uploaded URLs
                const existingUrls = editImages.filter(img => !img.file).map(img => img.url);
                imageUrls = [...existingUrls, ...uploadedUrls];
            } else {
                // No new files, just use existing URLs
                imageUrls = editImages.map(img => img.url);
            }

            await api.updateProduct(editProductId, {
                ...editFormData,
                images: imageUrls,
            } as Partial<Product> & { images?: string[] });
            setIsEditModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Failed to update product:', error);
            alert('Failed to update product');
        }
    };

    const handleGenerateAI = async (isEditMode: boolean = false) => {
        const data = isEditMode ? editFormData : formData;
        const currentImages = isEditMode ? editImages : images;
        const setImg = isEditMode ? setEditImages : setImages;

        if (!data.name || !data.categoryId) {
            alert('Please enter a product name and select a category first.');
            return;
        }

        // Find category name
        const category = categories.find(c => c.id === data.categoryId)?.name || 'Clothing';

        setIsGeneratingAI(true);
        try {
            const result = await api.generateAIImages({
                name: data.name!,
                category: category,
                description: data.description,
                color: data.color
            });

            if (result.isMock) {
                console.log(result.message);
            }

            const newImages = result.images.map((url, index) => ({
                url,
                orderNumber: currentImages.length + index + 1
            }));

            setImg([...currentImages, ...newImages]);

        } catch (error) {
            console.error('Failed to generate AI images:', error);
            alert('Failed to generate AI images');
        } finally {
            setIsGeneratingAI(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Inventory Management</h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            + Add Category
                        </button>
                        <button
                            onClick={() => setIsOccasionModalOpen(true)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            + Add Occasion
                        </button>
                        <button
                            onClick={() => setIsAgeGroupModalOpen(true)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            + Add Age Group
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            + Add Product
                        </button>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-medium">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price / Deposit</th>
                                <th className="px-6 py-4">Condition</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0">
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">No Img</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{product.name}</div>
                                                <div className="text-sm text-slate-400">{product.size} • {product.color}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{product.categoryName}</td>
                                    <td className="px-6 py-4 text-slate-300">
                                        <div>₹{product.price} <span className="text-xs text-slate-500">/day</span></div>
                                        <div className="text-xs text-slate-500">Dep: ₹{product.deposit}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={product.condition}
                                            onChange={(e) => handleStatusUpdate(product.id, e.target.value)}
                                            className={`bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer ${product.condition === 'available' ? 'text-green-400' :
                                                product.condition === 'rented' ? 'text-blue-400' :
                                                    product.condition === 'laundry' ? 'text-yellow-400' : 'text-red-400'
                                                }`}
                                        >
                                            <option value="available" className="bg-slate-800 text-green-400">Available</option>
                                            <option value="rented" className="bg-slate-800 text-blue-400">Rented</option>
                                            <option value="laundry" className="bg-slate-800 text-yellow-400">Laundry</option>
                                            <option value="damaged" className="bg-slate-800 text-red-400">Damaged</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                            {product.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium" onClick={() => handleEdit(product)}>Edit</button>
                                        <button className="text-red-400 hover:text-red-300 text-sm font-medium" onClick={() => handleDelete(product.id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && !loading && (
                        <div className="p-8 text-center text-slate-400">No products found. Add one to get started.</div>
                    )}
                </div>
            </div >

            {/* Category Modal */}
            {
                isCategoryModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-md">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Add New Category</h2>
                                <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                            </div>
                            <form onSubmit={handleCategorySubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={categoryForm.name}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Slug</label>
                                    <input
                                        required
                                        type="text"
                                        value={categoryForm.slug}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                    <textarea
                                        value={categoryForm.description}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryModalOpen(false)}
                                        className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all"
                                    >
                                        Create Category
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Occasion Modal */}
            {
                isOccasionModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-md">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Add New Occasion</h2>
                                <button onClick={() => setIsOccasionModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                            </div>
                            <form onSubmit={handleOccasionSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={occasionForm.name}
                                        onChange={(e) => setOccasionForm({ ...occasionForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Slug</label>
                                    <input
                                        required
                                        type="text"
                                        value={occasionForm.slug}
                                        onChange={(e) => setOccasionForm({ ...occasionForm, slug: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                    <textarea
                                        value={occasionForm.description}
                                        onChange={(e) => setOccasionForm({ ...occasionForm, description: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsOccasionModalOpen(false)}
                                        className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all"
                                    >
                                        Create Occasion
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Age Group Modal */}
            {
                isAgeGroupModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-md">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Add New Age Group</h2>
                                <button onClick={() => setIsAgeGroupModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                            </div>
                            <form onSubmit={handleAgeGroupSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={ageGroupForm.name}
                                        onChange={(e) => setAgeGroupForm({ ...ageGroupForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Slug</label>
                                    <input
                                        required
                                        type="text"
                                        value={ageGroupForm.slug}
                                        onChange={(e) => setAgeGroupForm({ ...ageGroupForm, slug: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                    <textarea
                                        value={ageGroupForm.description}
                                        onChange={(e) => setAgeGroupForm({ ...ageGroupForm, description: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsAgeGroupModalOpen(false)}
                                        className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all"
                                    >
                                        Create Age Group
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Product Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Add New Product</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                        <textarea
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                                        <select
                                            required
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Occasion</label>
                                        <select
                                            value={formData.occasionId}
                                            onChange={(e) => setFormData({ ...formData, occasionId: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Occasion</option>
                                            {occasions.map(o => (
                                                <option key={o.id} value={o.id}>{o.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Age Group</label>
                                        <select
                                            value={formData.ageGroupId}
                                            onChange={(e) => setFormData({ ...formData, ageGroupId: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Age Group</option>
                                            {ageGroups.map(ag => (
                                                <option key={ag.id} value={ag.id}>{ag.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Size</label>
                                        <select
                                            value={formData.size}
                                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Size</option>
                                            <option value="XS">XS</option>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                            <option value="XXL">XXL</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Price (Per Day)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Security Deposit</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.deposit}
                                            onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Color</label>
                                        <input
                                            type="text"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-slate-400">Product Images</label>
                                            <button
                                                type="button"
                                                onClick={() => handleGenerateAI(false)}
                                                disabled={isGeneratingAI}
                                                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isGeneratingAI ? (
                                                    <>
                                                        <span className="animate-spin">✨</span>
                                                        <span>Generating...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>✨</span>
                                                        <span>Generate with AI</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <ImageUploader
                                            images={images}
                                            onChange={setImages}
                                            maxImages={4}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all"
                                    >
                                        Create Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            {/* Edit Product Modal */}
            {
                isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Edit Product</h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                            </div>
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                        <textarea
                                            rows={3}
                                            value={editFormData.description}
                                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                                        <select
                                            required
                                            value={editFormData.categoryId}
                                            onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Occasion</label>
                                        <select
                                            value={editFormData.occasionId}
                                            onChange={(e) => setEditFormData({ ...editFormData, occasionId: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Occasion</option>
                                            {occasions.map(o => (
                                                <option key={o.id} value={o.id}>{o.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Age Group</label>
                                        <select
                                            value={editFormData.ageGroupId}
                                            onChange={(e) => setEditFormData({ ...editFormData, ageGroupId: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Age Group</option>
                                            {ageGroups.map(ag => (
                                                <option key={ag.id} value={ag.id}>{ag.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Size</label>
                                        <select
                                            value={editFormData.size}
                                            onChange={(e) => setEditFormData({ ...editFormData, size: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Size</option>
                                            <option value="XS">XS</option>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                            <option value="XXL">XXL</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Price (Per Day)</label>
                                        <input
                                            required
                                            type="number"
                                            value={editFormData.price}
                                            onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Security Deposit</label>
                                        <input
                                            required
                                            type="number"
                                            value={editFormData.deposit}
                                            onChange={(e) => setEditFormData({ ...editFormData, deposit: Number(e.target.value) })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Color</label>
                                        <input
                                            type="text"
                                            value={editFormData.color}
                                            onChange={(e) => setEditFormData({ ...editFormData, color: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                                        <select
                                            value={editFormData.status}
                                            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as 'active' | 'inactive' })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-slate-400">Product Images</label>
                                            <button
                                                type="button"
                                                onClick={() => handleGenerateAI(true)}
                                                disabled={isGeneratingAI}
                                                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isGeneratingAI ? (
                                                    <>
                                                        <span className="animate-spin">✨</span>
                                                        <span>Generating...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>✨</span>
                                                        <span>Generate with AI</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <ImageUploader
                                            images={editImages}
                                            onChange={setEditImages}
                                            maxImages={4}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
