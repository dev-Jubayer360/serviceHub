'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Mail, Phone, MapPin, Star, User, Calendar, CheckCircle } from 'lucide-react';
import { ServiceCard } from '@/components/shared/ServiceCard';

export default function ProviderProfilePage() {
  const { id } = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setIsLoading(true);
        const [profileRes, servicesRes, reviewsRes] = await Promise.all([
          api.get(`/user/provider/${id}`),
          api.get(`/services?providerId=${id}`),
          api.get(`/reviews/provider/${id}/public`)
        ]);

        if (profileRes.data.success) {
          setProvider(profileRes.data.data);
        }
        if (servicesRes.data.success) {
          setServices(servicesRes.data.data);
        }
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching provider profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProviderData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Provider Not Found</h2>
        <p className="text-muted mb-8">The provider you are looking for does not exist or has been removed.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Profile Header Card */}
        <Card className="mb-12 overflow-hidden border-none shadow-xl bg-white rounded-3xl">
          <div className="h-32 md:h-48 bg-primary/10 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
          </div>
          <CardContent className="px-6 md:px-12 pb-12 relative">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end -mt-16 md:-mt-24 mb-6">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg shrink-0 flex items-center justify-center text-primary text-5xl">
                {provider.image ? (
                  <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
                ) : (
                  provider.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
                      {provider.name}
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-2 font-medium">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      {provider.rating > 0 ? provider.rating.toFixed(1) : 'New'} ({provider.completedJobs || 0} Jobs Completed)
                    </p>
                  </div>
                  <Badge variant="outline" className="px-4 py-2 text-sm border-primary/20 bg-primary/5 text-primary">
                    Verified Provider
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border/50">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">Email Address</p>
                  <a href={`mailto:${provider.email}`} className="font-medium">{provider.email}</a>
                </div>
              </div>
              {provider.phone && (
                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">Phone Number</p>
                    <a href={`tel:${provider.phone}`} className="font-medium">{provider.phone}</a>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-0.5">Member Since</p>
                  <p className="font-medium">{new Date(provider.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Services Column */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                Services Offered
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">{services.length}</Badge>
              </h2>
              {services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <ServiceCard
                      key={service._id}
                      id={service._id}
                      title={service.title}
                      category={service.category?.name || 'General Service'}
                      providerName={provider.name}
                      price={service.price}
                      rating={service.rating}
                      image={service.images?.[0] || service.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop"}
                      location={service.locationCoverage || 'Citywide'}
                      isVerified={true}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border-2 bg-transparent">
                  <CardContent className="p-12 text-center text-muted">
                    <p>This provider currently has no active services.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Reviews Sidebar */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Customer Reviews
              <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none">{reviews.length}</Badge>
            </h2>
            
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review._id} className="border-none shadow-sm bg-white rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                            {review.userId?.image ? (
                              <img src={review.userId.image} alt={review.userId.name} className="w-full h-full object-cover" />
                            ) : (
                              review.userId?.name?.charAt(0).toUpperCase() || 'U'
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm">{review.userId?.name || 'User'}</h4>
                            <p className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground mb-3">{review.comment}</p>
                      <p className="text-xs text-muted font-medium bg-muted/10 inline-block px-2 py-1 rounded">
                        Service: {review.serviceId?.title || 'Unknown Service'}
                      </p>
                      
                      {review.reply && (
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10 ml-4">
                          <p className="text-xs font-semibold text-primary mb-1">Provider Reply:</p>
                          <p className="text-sm text-foreground">{review.reply}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 bg-transparent">
                <CardContent className="p-12 text-center text-muted">
                  <p>No reviews yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
