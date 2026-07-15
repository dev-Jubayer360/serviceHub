'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Edit, Eye, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ManageServicesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'provider') {
      router.push('/login');
      return;
    }

    const fetchServices = async () => {
      try {
        const res = await api.get(`/services?providerId=${user._id}`);
        if (res.data.success) {
          setServices(res.data.data.services || res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch services', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [user, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const res = await api.delete(`/services/${id}`);
        if (res.data.success) {
          setServices(services.filter(s => s._id !== id));
        }
      } catch (error) {
        console.error('Failed to delete service', error);
        alert('Failed to delete service');
      }
    }
  };

  if (authLoading || isLoading) return <div className="p-10 text-center">Loading services...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Services</h1>
          <p className="text-muted mt-1">View, edit or delete your active services.</p>
        </div>
        <Link href="/provider/services/add">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" /> Add Service
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-muted uppercase bg-muted/5 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Rating</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service._id} className="border-b border-border hover:bg-muted/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={service.image || service.images?.[0] || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=100&auto=format&fit=crop"} className="w-12 h-12 rounded-lg object-cover" alt={service.title} />
                        <span className="font-semibold text-foreground">{service.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted font-medium">{service.category?.name || 'General'}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">৳{service.price}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">{service.rating || 0}</td>
                    <td className="px-6 py-4"><Badge variant={service.isActive ? "secondary" : "outline"}>{service.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-2 text-muted-foreground hover:text-primary gap-1" onClick={() => router.push(`/services/${service._id}`)}>
                          <Eye className="w-4 h-4" /> <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-2 text-muted-foreground hover:text-blue-500 gap-1" onClick={() => router.push(`/provider/services/edit/${service._id}`)}>
                          <Edit className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-2 text-muted-foreground hover:text-red-500 gap-1" onClick={() => handleDelete(service._id)}>
                          <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted">You haven't listed any services yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
