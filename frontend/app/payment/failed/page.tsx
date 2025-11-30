'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function PaymentFailedContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const error = searchParams.get('error');

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-2xl mx-auto text-center py-20">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <h1 className="text-4xl font-bold mb-4">Payment Failed</h1>
                <p className="text-slate-400 mb-4">Unfortunately, your payment could not be processed.</p>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-8 inline-block">
                        <div className="text-red-300">{decodeURIComponent(error)}</div>
                    </div>
                )}

                <div className="flex gap-4 justify-center">
                    {orderId && (
                        <button
                            onClick={() => router.push(`/checkout?retry=${orderId}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Retry Payment
                        </button>
                    )}
                    <Link
                        href="/cart"
                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Back to Cart
                    </Link>
                </div>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
}

export default function PaymentFailedPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <PaymentFailedContent />
        </Suspense>
    );
}
