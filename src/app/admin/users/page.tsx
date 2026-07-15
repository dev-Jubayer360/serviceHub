'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Shield, User, Briefcase, ChevronDown } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/user/all');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err: any) {
      setError('Failed to fetch users. Ensure you have admin permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    try {
      setUpdatingId(userId);
      const res = await api.patch(`/user/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="accent" className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>;
      case 'provider':
        return <Badge variant="accent" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"><Briefcase className="w-3 h-3 mr-1" /> Provider</Badge>;
      default:
        return <Badge variant="accent" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"><User className="w-3 h-3 mr-1" /> Customer</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted mb-2">
            <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Manage Users</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted mt-1">View all users and update their roles.</p>
        </div>
        <Button variant="outline" onClick={fetchUsers}>Refresh Data</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
          ) : isLoading ? (
            <div className="py-8 text-center text-muted">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-xs text-muted uppercase bg-muted/5 border-y border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Joined Date</th>
                    <th className="px-4 py-3 font-medium">Current Role</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b border-border hover:bg-muted/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                      <td className="px-4 py-3 text-muted">{user.email}</td>
                      <td className="px-4 py-3 text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {updatingId === user._id ? (
                          <span className="text-xs text-muted">Updating...</span>
                        ) : (
                          <div className="inline-flex gap-2">
                            {user.role !== 'customer' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs px-2"
                                onClick={() => handleRoleChange(user._id, 'customer')}
                              >
                                Demote to Customer
                              </Button>
                            )}
                            {user.role !== 'provider' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs px-2"
                                onClick={() => handleRoleChange(user._id, 'provider')}
                              >
                                Make Provider
                              </Button>
                            )}
                            {user.role !== 'admin' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs px-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                                onClick={() => handleRoleChange(user._id, 'admin')}
                              >
                                Make Admin
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
