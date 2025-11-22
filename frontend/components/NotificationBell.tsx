'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api/api';
import { Notification } from '@/lib/types';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await api.getNotifications(5, 0);
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread || 0);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.markNotificationAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-lg border border-white/10 z-20">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <h3 className="font-semibold text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs text-blue-400">{unreadCount} unread</span>
                            )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => {
                                            if (!notification.isRead) {
                                                handleMarkAsRead(notification.id);
                                            }
                                        }}
                                        className={`p-4 border-b border-white/5 hover:bg-slate-700 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-500/10' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.isRead ? 'bg-blue-500' : 'bg-slate-600'
                                                }`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-white text-sm">
                                                    {notification.title}
                                                </div>
                                                <div className="text-slate-400 text-xs mt-1">
                                                    {notification.message}
                                                </div>
                                                <div className="text-slate-500 text-xs mt-1">
                                                    {formatDate(notification.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-400">
                                    No notifications
                                </div>
                            )}
                        </div>
                        <div className="p-3 border-t border-white/10">
                            <Link
                                href="/notifications"
                                onClick={() => setShowDropdown(false)}
                                className="block text-center text-sm text-blue-400 hover:text-blue-300"
                            >
                                View All Notifications
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
