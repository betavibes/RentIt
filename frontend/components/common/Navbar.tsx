'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import NotificationBell from '@/components/NotificationBell';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);

    return (
        <nav className="bg-slate-900 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-slate-900/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-extrabold logo-gradient tracking-tight">
                                Bharat Costumes
                            </span>
                        </Link>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
                        <div className="flex space-x-6">
                            <Link href="/products" className="border-transparent text-slate-300 hover:text-white hover:border-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                Collection
                            </Link>
                            <Link href="/why-rent" className="border-transparent text-slate-300 hover:text-white hover:border-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                Why Rent?
                            </Link>
                            <Link href="/how-it-works" className="border-transparent text-slate-300 hover:text-white hover:border-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                How it Works
                            </Link>
                            <Link href="/schools-events" className="border-transparent text-slate-300 hover:text-white hover:border-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                Schools & Events
                            </Link>
                            <Link href="/about" className="border-transparent text-slate-300 hover:text-white hover:border-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                About Us
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4 border-l border-slate-700 pl-6">
                            {user ? (
                                <>
                                    {isAdmin && (
                                        <Link href="/admin/dashboard" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            Admin Panel
                                        </Link>
                                    )}
                                    <div className="relative ml-3">
                                        <button
                                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                            className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-blue-500 transition-all"
                                        >
                                            <span className="sr-only">Open user menu</span>
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        </button>

                                        {isProfileMenuOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10 cursor-default"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                />
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                                                    {!isAdmin && (
                                                        <Link
                                                            href="/dashboard"
                                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                                                            onClick={() => setIsProfileMenuOpen(false)}
                                                        >
                                                            Dashboard
                                                        </Link>
                                                    )}
                                                    {!isAdmin && (
                                                        <Link
                                                            href="/orders"
                                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                                                            onClick={() => setIsProfileMenuOpen(false)}
                                                        >
                                                            My Orders
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href="/profile"
                                                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                                                        onClick={() => setIsProfileMenuOpen(false)}
                                                    >
                                                        Your Profile
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setIsProfileMenuOpen(false);
                                                            logout();
                                                        }}
                                                        className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                                                    >
                                                        Sign out
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
                                    >
                                        Login / Sign Up
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isAuthDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setIsAuthDropdownOpen(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-2xl py-2 bg-gradient-to-br from-slate-50 to-white ring-1 ring-slate-200 z-20 overflow-hidden">
                                                <Link
                                                    href="/auth/login"
                                                    className="group block px-5 py-4 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 relative overflow-hidden"
                                                    onClick={() => setIsAuthDropdownOpen(false)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Already have an account?</div>
                                                            <div className="text-xs text-slate-500 mt-0.5">Login to continue</div>
                                                        </div>
                                                        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </Link>
                                                <div className="border-t border-slate-200 my-1 mx-3"></div>
                                                <Link
                                                    href="/auth/register"
                                                    className="group block px-5 py-4 text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 relative overflow-hidden"
                                                    onClick={() => setIsAuthDropdownOpen(false)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors">New here?</div>
                                                            <div className="text-xs text-slate-500 mt-0.5">Create your account</div>
                                                        </div>
                                                        <svg className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="sm:hidden bg-slate-800 border-b border-white/10">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link href="/products" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">
                            Collection
                        </Link>
                        <Link href="/why-rent" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">
                            Why Rent?
                        </Link>
                        <Link href="/how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">
                            How it Works
                        </Link>
                        <Link href="/schools-events" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">
                            Schools & Events
                        </Link>
                        <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">
                            About Us
                        </Link>
                    </div>
                    <div className="pt-4 pb-4 border-t border-slate-700">
                        {user ? (
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                    <div className="text-sm font-medium leading-none text-slate-400 mt-1">{user.email}</div>
                                </div>
                                <button onClick={logout} className="ml-auto bg-slate-800 flex-shrink-0 p-1 rounded-full text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white">
                                    <span className="sr-only">Sign out</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="mt-3 px-2 space-y-2">
                                <Link
                                    href="/auth/login"
                                    className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-base font-medium transition-all text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="block bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-md text-base font-medium transition-all text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
