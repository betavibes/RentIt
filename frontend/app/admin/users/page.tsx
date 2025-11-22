'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import api from '@/lib/api/api';
import { User } from '@/lib/types';

export default function AdminUsersPage() {
    const { user, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await api.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId: string, currentStatus: boolean) => {
        try {
            const updatedUser = await api.updateUserStatus(userId, !currentStatus);
            setUsers(users.map(u => u.id === userId ? { ...u, isActive: updatedUser.isActive } : u));
        } catch (err) {
            alert('Failed to update user status');
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const updatedUser = await api.updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: updatedUser.role } : u));
        } catch (err) {
            alert('Failed to update user role');
        }
    };

    if (authLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
        return <div className="text-white text-center mt-10">Access Denied</div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <div className="bg-slate-800 px-4 py-2 rounded-lg text-slate-300">
                        Total Users: {users.length}
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="bg-slate-800 shadow-xl rounded-xl overflow-hidden border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Joined</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-800 divide-y divide-slate-700">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">{u.name}</div>
                                                    <div className="text-sm text-slate-400">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="staff">Staff</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {u.isActive ? 'Active' : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleStatusChange(u.id, u.isActive ?? true)}
                                                className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${u.isActive
                                                    ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                                                    : 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
                                                    }`}
                                            >
                                                {u.isActive ? 'Block' : 'Unblock'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
