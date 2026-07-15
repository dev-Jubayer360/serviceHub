'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, ShieldCheck, Ban, CheckCircle, Search } from 'lucide-react';
import api from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProviders = async () => {
    try {
      const res = await api.get('/user/all?role=provider');
      setProviders(res.data.data);
    } catch (err: any) {
      setError('Failed to fetch providers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleVerify = async (id: string, isVerified: boolean) => {
    try {
      const res = await api.patch(`/user/${id}/verify-provider`, { isVerifiedProvider: isVerified });
      if (res.data.success) {
        setProviders(prev => prev.map(p => p._id === id ? { ...p, isVerifiedProvider: isVerified } : p));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update provider status');
    }
  };

  const filteredProviders = providers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Providers</h1>
          <p className="text-muted mt-1">View and manage service providers on the platform.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Provider List</CardTitle>
          <div className="w-full sm:w-64">
             <Input 
               placeholder="Search providers..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               icon={<Search className="w-4 h-4" />}
             />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left border-collapse min-w-[800px]">
                <thead className="text-xs text-muted uppercase bg-muted/5 border-y border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Provider Info</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Specialization</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProviders.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-muted">No providers found.</td></tr>
                  ) : filteredProviders.map(provider => (
                    <tr key={provider._id} className="border-b border-border hover:bg-muted/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={provider.image || 'https://i.pravatar.cc/150'} alt={provider.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <div className="font-semibold text-foreground flex items-center gap-1">
                              {provider.name}
                              {provider.isVerifiedProvider && <CheckCircle className="w-3 h-3 text-green-500" />}
                            </div>
                            <div className="text-xs text-muted">Joined: {new Date(provider.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-foreground">{provider.email}</div>
                        <div className="text-xs text-muted">{provider.phone || 'No phone'}</div>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {provider.specialization || 'Not specified'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={provider.isVerifiedProvider ? 'success' : 'accent'}>
                          {provider.isVerifiedProvider ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant={provider.isVerifiedProvider ? 'outline' : 'primary'} onClick={() => handleVerify(provider._id, !provider.isVerifiedProvider)}>
                            {provider.isVerifiedProvider ? <Ban className="w-4 h-4 mr-1"/> : <ShieldCheck className="w-4 h-4 mr-1" />}
                            {provider.isVerifiedProvider ? 'Revoke' : 'Verify'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
