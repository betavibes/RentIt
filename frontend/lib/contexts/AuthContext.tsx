'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import api from '../api/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    socialLogin: (token: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const userData = await api.getCurrentUser();
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            // Do not remove token here. API interceptor handles 401.
            // Removing it here causes logout on network errors.
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        const response = await api.login(credentials);
        setUser(response.user);
        router.push(response.user.role === 'admin' ? '/admin/dashboard' : '/');
    };

    const socialLogin = async (token: string) => {
        localStorage.setItem('token', token);
        const userData = await api.getCurrentUser();
        setUser(userData);
        router.push(userData.role === 'admin' ? '/admin/dashboard' : '/');
    };

    const register = async (data: RegisterData) => {
        const response = await api.register(data);
        setUser(response.user);
        router.push('/');
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            socialLogin,
            register,
            logout,
            isAdmin: user?.role === 'admin' || user?.role === 'staff'
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
