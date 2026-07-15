'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UploadCloud, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AddServicePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    pricingType: 'fixed',
    location: 'Anywhere in City',
    category: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'provider') {
      router.push('/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            setFormData(prev => ({ ...prev, category: res.data.data[0]._id }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let imageUrl = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=100&auto=format&fit=crop';
      
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data.success) {
          imageUrl = uploadRes.data.data.url;
        }
      }

      const res = await api.post('/services', {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        pricingType: formData.pricingType,
        location: formData.location,
        category: formData.category,
        image: imageUrl
      });

      if (res.data.success) {
        router.push('/provider/services/manage');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create service');
      setIsSubmitting(false);
    }
  };

  if (authLoading) return null;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Service</h1>
          <p className="text-muted mt-1">Create a new service listing to offer to customers.</p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish Service'}
          </Button>
        </div>
      </div>
      
      {error && <div className="p-4 bg-red-100 text-red-600 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                label="Service Title" 
                placeholder="e.g. Professional AC Repair" 
                required 
              />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="flex w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[160px]"
                  placeholder="Provide detailed information about the service..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing & Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                name="price"
                value={formData.price}
                onChange={handleChange}
                label="Price (৳)" 
                type="number" 
                placeholder="e.g. 1500" 
                required
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Service Type</label>
                <select 
                  name="pricingType"
                  value={formData.pricingType}
                  onChange={handleChange}
                  className="w-full h-11 rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Location Coverage</label>
                <select 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full h-11 rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
                >
                  <option value="Anywhere in City">Anywhere in City</option>
                  <option value="Specific Areas">Specific Areas</option>
                  <option value="My Workshop Only">My Workshop Only</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings Area */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categorization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-11 rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
                  required
                >
                  {categories.length === 0 ? (
                    <option value="">No Categories Found</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))
                  )}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service Image</CardTitle>
            </CardHeader>
            <CardContent>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
              {imagePreview ? (
                <div className="relative border-2 border-border rounded-xl overflow-hidden group">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-black mr-2" onClick={() => fileInputRef.current?.click()}>
                      Change
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/5 transition-colors h-48"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Click to upload</h4>
                  <p className="text-xs text-muted">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </form>
  );
}
