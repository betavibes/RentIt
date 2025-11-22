'use client';

import React, { useState } from 'react';
import StarRating from './StarRating';

interface ReviewFormProps {
    productId: string;
    orderId: string;
    existingReview?: any;
    onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
    onCancel: () => void;
}

export default function ReviewForm({
    productId,
    orderId,
    existingReview,
    onSubmit,
    onCancel
}: ReviewFormProps) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit({ rating, comment });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">
                {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>

            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-400 mb-3">
                        Your Rating *
                    </label>
                    <StarRating
                        rating={rating}
                        size="lg"
                        interactive
                        onChange={setRating}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        Your Review (Optional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        placeholder="Share your experience with this product..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                    />
                    <div className="text-xs text-slate-500 mt-1">
                        {comment.length} / 500 characters
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        {submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
