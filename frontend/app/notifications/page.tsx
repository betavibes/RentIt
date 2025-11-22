'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/api';
import { Notification } from '@/lib/types';

export default function NotificationsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        fetchNotifications();
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const data = await api.getNotifications(50, 0);
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
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

    const handleMarkAllAsRead = async () => {
        try {
            await api.markAllNotificationsAsRead();
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.deleteNotification(id);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Notifications</h1>
                    {notifications.some(n => !n.isRead) && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-blue-400 hover:text-blue-300"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'unread'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                    >
                        Unread ({notifications.filter(n => !n.isRead).length})
                    </button>
                </div>

                {/* Notifications List */}
                {filteredNotifications.length > 0 ? (
                    <div className="space-y-3">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-slate-800 rounded-xl p-6 border ${!notification.isRead
                                        ? 'border-blue-500/50 bg-blue-500/5'
                                        : 'border-white/10'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${!notification.isRead ? 'bg-blue-500' : 'bg-slate-600'
                                            }`} />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white mb-1">
                                                {notification.title}
                                            </h3>
                                            <p className="text-slate-300 text-sm mb-2">
                                                {notification.message}
                                            </p>
                                            <div className="text-xs text-slate-500">
                                                {formatDate(notification.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className="text-sm text-blue-400 hover:text-blue-300"
                                            >
                                                Mark read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification.id)}
                                            className="text-sm text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800 rounded-xl border border-white/10">
                        <p className="text-slate-400 text-lg">No notifications to display</p>
                    </div>
                )}
            </div>
        </div>
    );
}
