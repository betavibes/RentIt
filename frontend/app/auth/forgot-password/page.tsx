'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock API call
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    return (
        <div>
            <div className="text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-white">
                    Reset Password
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                    Enter your email to receive reset instructions
                </p>
            </div>

            {!submitted ? (
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-600 placeholder-slate-400 text-white bg-slate-800/50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm backdrop-blur-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-blue-500/30 transition-all"
                        >
                            Send Reset Link
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <Link href="/auth/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                            Back to Sign in
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="mt-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-white">Check your email</h3>
                    <p className="mt-2 text-sm text-slate-300">
                        We have sent a password reset link to <strong>{email}</strong>.
                    </p>
                    <div className="mt-6">
                        <Link href="/auth/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                            Back to Sign in
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
