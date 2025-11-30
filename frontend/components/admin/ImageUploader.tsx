'use client';

import React, { useState, useRef } from 'react';

interface ImageData {
    url: string;
    orderNumber: number;
    file?: File;
}

interface ImageUploaderProps {
    images: ImageData[];
    onChange: (images: ImageData[]) => void;
    maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 4 }: ImageUploaderProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remainingSlots = maxImages - images.length;
        const filesToAdd = files.slice(0, remainingSlots);

        const newImages: ImageData[] = filesToAdd.map((file, index) => ({
            url: URL.createObjectURL(file),
            orderNumber: images.length + index + 1,
            file
        }));

        onChange([...images, ...newImages]);
    };

    const handleRemove = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        // Renumber remaining images
        const renumbered = newImages.map((img, i) => ({
            ...img,
            orderNumber: i + 1
        }));
        onChange(renumbered);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const draggedImage = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);

        // Renumber after reordering
        const renumbered = newImages.map((img, i) => ({
            ...img,
            orderNumber: i + 1
        }));

        onChange(renumbered);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-4">
            {/* Upload Button */}
            {images.length < maxImages && (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 px-4 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
                    >
                        📷 Upload Images ({images.length}/{maxImages})
                    </button>
                </div>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`relative group cursor-move border-2 rounded-lg overflow-hidden ${draggedIndex === index ? 'border-blue-500 opacity-50' : 'border-slate-700'
                                } ${index === 0 ? 'ring-2 ring-blue-500' : ''}`}
                        >
                            {/* Order Number Badge */}
                            <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {image.orderNumber}
                            </div>

                            {/* Primary Badge */}
                            {index === 0 && (
                                <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                                    PRIMARY
                                </div>
                            )}

                            {/* Image */}
                            <img
                                src={image.url}
                                alt={`Product ${image.orderNumber}`}
                                className="w-full h-32 object-cover"
                            />

                            {/* Remove Button */}
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                                <span className="text-white text-2xl">🗑️</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Instructions */}
            <p className="text-xs text-slate-500">
                💡 Drag images to reorder. First image is the primary image shown on product cards.
            </p>
        </div>
    );
}
