'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

export const dynamic = 'force-dynamic';

export default function AuthSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { socialLogin } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            socialLogin(token).catch((err) => {
                console.error('Social login failed:', err);
                router.push('/auth/login?error=auth_failed');
            });
        } else {
            router.push('/auth/login?error=no_token');
        }
    }, [searchParams, socialLogin, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white text-lg">Authenticating...</p>
            </div>
        </div>
    );
}
