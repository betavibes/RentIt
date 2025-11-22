'use client';

import React from 'react';
import StarRating from './StarRating';
import { Review } from '@/lib/types';
import { useAuth } from '@/lib/contexts/AuthContext';

interface ReviewListProps {
    reviews: Review[];
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: string) => void;
}

export default function ReviewList({ reviews, onEdit, onDelete }: ReviewListProps) {
    const { user } = useAuth();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
        return date.toLocaleDateString();
    };

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-800 rounded-xl border border-white/10">
                <p className="text-slate-400">No reviews yet. Be the first to review!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => {
                const isOwnReview = user?.id === review.userId;
                const canEdit = isOwnReview && onEdit;
                const canDelete = (isOwnReview || user?.role === 'admin') && onDelete;

                return (
                    <div
                        key={review.id}
                        className="bg-slate-800 rounded-xl p-6 border border-white/10"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {review.userName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <div className="font-medium text-white">{review.userName || 'Anonymous'}</div>
                                    <div className="text-sm text-slate-400">{formatDate(review.createdAt)}</div>
                                </div>
                            </div>
                            {(canEdit || canDelete) && (
                                <div className="flex gap-2">
                                    {canEdit && (
                                        <button
                                            onClick={() => onEdit(review)}
                                            className="text-sm text-blue-400 hover:text-blue-300"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {canDelete && (
                                        <button
                                            onClick={() => onDelete(review.id)}
                                            className="text-sm text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <StarRating rating={review.rating} size="sm" />
                        </div>

                        {review.comment && (
                            <p className="text-slate-300 leading-relaxed">{review.comment}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
