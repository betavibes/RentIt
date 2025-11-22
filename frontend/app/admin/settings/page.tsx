'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/api';
import { Setting } from '@/lib/types';

export default function AdminSettingsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('business');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        if (user.role !== 'admin') {
            router.push('/');
            return;
        }
        fetchSettings();
    }, [user]);

    const fetchSettings = async () => {
        try {
            const data = await api.getAllSettings();
            setSettings(data);

            // Initialize form data
            const initialData: Record<string, string> = {};
            data.forEach((setting: Setting) => {
                initialData[setting.key] = setting.value;
            });
            setFormData(initialData);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setMessage('');
        setError('');
        setSaving(true);

        try {
            const settingsToUpdate = settings.map(setting => ({
                key: setting.key,
                value: formData[setting.key]
            }));

            await api.updateMultipleSettings(settingsToUpdate);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const getSettingsByCategory = (category: string) => {
        return settings.filter(s => s.category === category);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    const tabs = [
        { id: 'business', label: 'Business Information' },
        { id: 'rental', label: 'Rental Policies' },
        { id: 'system', label: 'System Preferences' }
    ];

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

                {message && (
                    <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-700">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 font-medium transition-colors ${activeTab === tab.id
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Settings Form */}
                <div className="bg-slate-800 rounded-xl p-6 border border-white/10 mb-6">
                    <div className="space-y-6">
                        {getSettingsByCategory(activeTab).map(setting => (
                            <div key={setting.key}>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    {setting.description || setting.key}
                                </label>
                                <input
                                    type="text"
                                    value={formData[setting.key] || ''}
                                    onChange={(e) => handleInputChange(setting.key, e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={() => router.push('/admin/inventory')}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
