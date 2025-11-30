'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const transactionId = searchParams.get('transactionId');

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-2xl mx-auto text-center py-20">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-slate-400 mb-8">Your order has been confirmed and payment processed successfully.</p>

                {transactionId && (
                    <div className="bg-slate-800 rounded-lg p-4 mb-8 inline-block">
                        <div className="text-sm text-slate-400">Transaction ID</div>
                        <div className="font-mono text-lg">{transactionId}</div>
                    </div>
                )}

                <div className="flex gap-4 justify-center">
                    {orderId && (
                        <Link
                            href={`/orders/${orderId}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            View Order Details
                        </Link>
                    )}
                    <Link
                        href="/products"
                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
