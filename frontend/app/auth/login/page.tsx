'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-white">
                    Welcome Back
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                    Sign in to access your premium rental experience
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <input
                            type="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-600 placeholder-slate-400 text-white bg-slate-800/50 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm backdrop-blur-sm"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-600 placeholder-slate-400 text-white bg-slate-800/50 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm backdrop-blur-sm"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/30"
                    >
                        {loading ? (
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="animate-spin h-5 w-5 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </span>
                        ) : null}
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>

                {/* Quick Admin Login - FOR TESTING ONLY */}
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({ email: 'admin@rentit.com', password: 'admin123' });
                            setTimeout(() => {
                                const form = document.querySelector('form');
                                if (form) form.requestSubmit();
                            }, 100);
                        }}
                        className="w-full flex justify-center py-2 px-4 border border-yellow-600/50 text-sm font-medium rounded-md text-yellow-400 bg-yellow-900/20 hover:bg-yellow-900/30 transition-all duration-200"
                    >
                        🔑 Quick Admin Login (Testing)
                    </button>
                </div>

                <div className="text-center mt-4">

                    <p className="text-sm text-slate-300">
                        Don't have an account?{' '}
                        <Link href="/auth/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                            Sign up now
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
