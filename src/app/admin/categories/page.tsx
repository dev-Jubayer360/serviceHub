'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loader2, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import api from '@/lib/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ _id: '', name: '', description: '', image: '', status: 'Active' });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category?: any) => {
    if (category) {
      setFormData({ 
        _id: category._id, 
        name: category.name, 
        description: category.description || '', 
        image: category.image || '', 
        status: category.status 
      });
    } else {
      setFormData({ _id: '', name: '', description: '', image: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData._id) {
        await api.patch(`/categories/${formData._id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      await fetchCategories();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Categories</h1>
          <p className="text-muted mt-1">Add, edit, or remove service categories.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => openModal()}>
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Category List</CardTitle>
          <div className="w-full sm:w-64">
             <Input 
               placeholder="Search categories..." 
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
              <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                <thead className="text-xs text-muted uppercase bg-muted/5 border-y border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Category Info</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-muted">No categories found.</td></tr>
                  ) : filteredCategories.map(category => (
                    <tr key={category._id} className="border-b border-border hover:bg-muted/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center overflow-hidden shrink-0">
                            {category.image ? <img src={category.image} alt={category.name} className="w-full h-full object-cover"/> : <span className="text-lg">📁</span>}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{category.name}</div>
                            <div className="text-xs text-muted max-w-xs truncate">{category.description || 'No description'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted font-mono text-xs">{category.slug}</td>
                      <td className="px-4 py-3">
                        <Badge variant={category.status === 'Active' ? 'success' : 'accent'}>
                          {category.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openModal(category)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50 hover:border-red-200" onClick={() => handleDelete(category._id)}>
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

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-full">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-bold text-lg">{formData._id ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <form id="categoryForm" onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  label="Category Name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea 
                    className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none h-24 text-sm"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <Input 
                  label="Image URL (Optional)" 
                  value={formData.image} 
                  onChange={e => setFormData({...formData, image: e.target.value})} 
                />
                <div>
                   <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                   <select 
                     className="w-full p-3 rounded-xl border border-border bg-background outline-none text-sm"
                     value={formData.status}
                     onChange={e => setFormData({...formData, status: e.target.value})}
                   >
                     <option value="Active">Active</option>
                     <option value="Inactive">Inactive</option>
                   </select>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/5">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" form="categoryForm" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Category'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
