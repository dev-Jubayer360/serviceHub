'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProviderCard } from '@/components/shared/ProviderCard';
import api from '@/lib/api';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get('/user/providers');
        if (res.data.success) {
          setProviders(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch providers', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.address && p.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Page Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">Our Trusted Providers</h1>
        <p className="text-lg text-muted">
          Browse our network of verified professionals. Read reviews, compare ratings, and book the right person for your job.
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-border/50 mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input 
              icon={<Search className="w-5 h-5" />} 
              placeholder="Search by name or location..." 
              className="bg-muted/30 border-transparent focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <select className="h-11 rounded-xl border border-transparent bg-muted/30 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground w-full md:w-auto">
              <option value="rating">Highest Rated</option>
              <option value="jobs">Most Jobs Completed</option>
              <option value="newest">Newest First</option>
            </select>
            <Button variant="outline" className="hidden md:flex">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="mb-4 text-sm text-muted">
        {isLoading ? 'Loading providers...' : `Showing ${filteredProviders.length} providers`}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-muted/20 h-80 rounded-2xl"></div>
          ))}
        </div>
      ) : filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProviders.map(provider => (
            <ProviderCard 
              key={provider._id}
              id={provider._id}
              image={provider.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop'}
              name={provider.name}
              specialization={provider.specialization || 'Professional Service Provider'}
              experience={provider.experience || '3+ Years'}
              rating={provider.rating || 0}
              completedJobs={provider.completedJobs || 0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border">
          <Search className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No providers found</h3>
          <p className="text-muted">We couldn't find any providers matching your search.</p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => setSearchQuery('')}
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}
