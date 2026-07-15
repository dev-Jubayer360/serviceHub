'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Heart, Star, MapPin } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

// Favourites data is fetched from the API

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await api.get('/favourites');
        if (res.data.success) {
          setFavourites(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching favourites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  const removeFavourite = async (serviceId: string) => {
    try {
      await api.delete(`/favourites/${serviceId}`);
      setFavourites((prev) => prev.filter((fav) => fav.service._id !== serviceId));
    } catch (error) {
      console.error('Error removing favourite:', error);
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center">Loading favourites...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Favourites</h1>
        <p className="text-muted mt-1">Services you have saved for later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favourites.map((fav) => {
          const service = fav.service;
          if (!service) return null;
          return (
          <Card key={fav._id} className="overflow-hidden group hover:border-primary/50 transition-colors flex flex-col h-full">
            <div className="relative h-48 w-full">
              <img 
                src={service.image || service.images?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'} 
                alt={service.title} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <Button 
                  size="sm" 
                  onClick={() => removeFavourite(service._id)}
                  className="h-8 w-8 rounded-full bg-white text-destructive hover:bg-white/90 shadow-sm p-0 flex items-center justify-center"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
              <div className="absolute top-3 left-3">
                <Badge className="bg-background/90 text-foreground backdrop-blur-sm hover:bg-background border-none">
                  {service.category?.name || 'Service'}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/services/${service._id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-bold text-lg line-clamp-1">{service.title}</h3>
                </Link>
              </div>
              
              <div className="flex items-center text-sm text-muted mb-4">
                <span className="font-medium text-foreground">{service.provider?.name || 'Provider'}</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium text-foreground mr-1">{service.rating || 0}</span>
                  ({service.reviews || 0})
                </span>
              </div>
              
              <div className="flex items-center text-sm text-muted mb-4">
                <MapPin className="h-4 w-4 mr-1 text-primary/70" />
                <span className="line-clamp-1">{service.location?.address || 'Location'}</span>
              </div>
              
              <div className="mt-auto pt-4 border-t flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted">Starting from</span>
                  <div className="font-bold text-lg text-foreground">৳{service.price}</div>
                </div>
                <Button asChild size="sm">
                  <Link href={`/services/${service._id}`}>Book Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          );
        })}
        
        {/* Placeholder for Add More */}
        <Link href="/services">
          <Card className="h-full border-dashed border-2 bg-transparent hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[350px]">
            <CardContent className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Discover Services</h3>
              <p className="text-sm text-muted">Find more services to add to your favourites list.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
