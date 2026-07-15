'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loader2, Search, Trash2, Edit, X } from 'lucide-react';
import api from '@/lib/api';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ _id: '', title: '', price: 0, isActive: true });

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data.data);
    } catch (err: any) {
      setError('Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openEditModal = (service: any) => {
    setFormData({
      _id: service._id,
      title: service.title,
      price: service.price,
      isActive: service.isActive
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/services/${formData._id}`, formData);
      await fetchServices();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete service');
      }
    }
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.provider && s.provider.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Services</h1>
          <p className="text-muted mt-1">Monitor all services created by providers.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Service Catalog</CardTitle>
          <div className="w-full sm:w-64">
             <Input 
               placeholder="Search services..." 
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
                    <th className="px-4 py-3 font-medium">Service Info</th>
                    <th className="px-4 py-3 font-medium">Provider</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-muted">No services found.</td></tr>
                  ) : filteredServices.map(service => (
                    <tr key={service._id} className="border-b border-border hover:bg-muted/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=100&auto=format&fit=crop'} alt={service.title} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <div className="font-semibold text-foreground">{service.title}</div>
                            <div className="text-xs text-muted">{service.category?.name || 'Uncategorized'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{service.provider?.name || 'Unknown'}</div>
                      </td>
                      <td className="px-4 py-3 font-bold text-foreground">
                        ৳{service.price} <span className="text-xs font-normal text-muted">({service.serviceType})</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={service.isActive ? 'success' : 'accent'}>
                          {service.isActive ? 'Active' : 'Hidden'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditModal(service)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50 hover:border-red-200" onClick={() => handleDelete(service._id)}>
                            <Trash2 className="w-4 h-4" />
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

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-bold text-lg">Edit Service</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <form id="serviceForm" onSubmit={handleUpdate} className="space-y-4">
                <Input 
                  label="Title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                />
                <Input 
                  label="Base Price" 
                  type="number"
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                  required 
                />
                <div>
                   <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                   <select 
                     className="w-full p-3 rounded-xl border border-border bg-background outline-none text-sm"
                     value={formData.isActive.toString()}
                     onChange={e => setFormData({...formData, isActive: e.target.value === 'true'})}
                   >
                     <option value="true">Active</option>
                     <option value="false">Hidden</option>
                   </select>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/5">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" form="serviceForm" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
