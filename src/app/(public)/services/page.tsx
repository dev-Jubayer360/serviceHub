'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ServiceCard } from '@/components/shared/ServiceCard';
import api from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';
import { districts } from '@/lib/districts';

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');

  const fetchServices = async (
    searchParam = searchQuery, 
    locationParam = location, 
    categoryParam = category,
    minPriceParam = minPrice,
    maxPriceParam = maxPrice,
    minRatingParam = minRating
  ) => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (searchParam) params.search = searchParam;
      if (locationParam) params.location = locationParam;
      if (categoryParam) params.category = categoryParam;
      if (minPriceParam) params.minPrice = minPriceParam;
      if (maxPriceParam) params.maxPrice = maxPriceParam;
      if (minRatingParam) params.minRating = minRatingParam;
      
      const res = await api.get('/services', { params });
      if (res.data.success) {
        setServices(res.data.data.services || res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    api.get('/categories').then(res => {
      if (res.data.success) setCategories(res.data.data);
    }).catch(console.error);
  }, []);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (minRating) params.append('minRating', minRating);
    router.replace(`/services?${params.toString()}`);
    fetchServices(searchQuery, location, category, minPrice, maxPrice, minRating);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Explore Services</h1>
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input 
              icon={<Search className="w-5 h-5" />} 
              placeholder="Search for services (e.g. AC Repair, Cleaning)..." 
              className="bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            />
          </div>
          <Button 
            className="sm:hidden" 
            variant="outline" 
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
          <div className="hidden sm:block w-48">
            <select className="w-full h-11 rounded-xl border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground">
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price Low-High</option>
              <option value="price_desc">Price High-Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <div className={`lg:w-64 shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
          <Card className="sticky top-28 p-6 space-y-8">
            <div className="flex items-center gap-2 font-semibold text-lg text-foreground border-b border-border pb-4">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category"
                    checked={category === ''}
                    onChange={() => setCategory('')}
                    className="text-primary focus:ring-primary h-4 w-4 border-border" 
                  />
                  <span className="text-sm text-muted hover:text-foreground">All Categories</span>
                </label>
                {categories.map(cat => (
                  <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category"
                      checked={category === cat.slug}
                      onChange={() => setCategory(cat.slug)}
                      className="text-primary focus:ring-primary h-4 w-4 border-border" 
                    />
                    <span className="text-sm text-muted hover:text-foreground">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Location (District)</h3>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-white pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none cursor-pointer"
                >
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district} value={district.toLowerCase()}>{district}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                />
                <span className="text-muted">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Minimum Rating</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating" 
                    checked={minRating === ''}
                    onChange={() => setMinRating('')}
                    className="text-primary focus:ring-primary h-4 w-4 border-border" 
                  />
                  <span className="flex items-center text-sm text-muted">
                    Any Rating
                  </span>
                </label>
                {[4.5, 4.0, 3.5, 3.0].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={minRating === String(rating)}
                      onChange={() => setMinRating(String(rating))}
                      className="text-primary focus:ring-primary h-4 w-4 border-border" 
                    />
                    <span className="flex items-center text-sm text-muted">
                      {rating} & up <Star className="w-3 h-3 ml-1 fill-accent text-accent" />
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Button onClick={handleApplyFilters} fullWidth>Apply Filters</Button>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="flex-1">
          <div className="mb-4 text-sm text-muted">
            {isLoading ? 'Loading services...' : `Showing ${services.length} services`}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-muted/20 h-72 rounded-2xl"></div>
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
              {services.map((service) => (
                <ServiceCard 
                  key={service._id} 
                  id={service._id} 
                  title={service.title}
                  category={service.category?.name || 'General'}
                  price={service.price}
                  rating={service.rating || 0}
                  location={service.location || 'Dhaka, Bangladesh'}
                  isVerified={true}
                  providerName={service.provider?.name || 'Trusted Provider'} 
                  image={service.image || service.images?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070'} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted">No services found matching your criteria.</div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="primary" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="text-muted mx-1">...</span>
            <Button variant="outline" size="sm">12</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10 text-center text-muted">Loading services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
