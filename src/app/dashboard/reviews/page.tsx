'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star, MoreVertical, Edit2, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ReviewsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;
      try {
        const res = await api.get('/reviews/my-reviews');
        if (res.data.success) {
          setReviews(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!authLoading) {
      fetchReviews();
    }
  }, [user, authLoading]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-muted-foreground opacity-30'}`} 
      />
    ));
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Reviews</h1>
          <p className="text-muted mt-1">Manage the reviews you've written for services.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <h3 className="text-4xl font-bold text-primary mb-2">{reviews.length}</h3>
            <p className="text-sm text-muted-foreground font-medium">Total Reviews</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <h3 className="text-4xl font-bold text-primary mb-2 flex items-center">
              {averageRating} <Star className="h-6 w-6 ml-2 text-yellow-500 fill-current" />
            </h3>
            <p className="text-sm text-muted-foreground font-medium">Average Rating Given</p>
          </CardContent>
        </Card>
        <Card className="border-dashed border-2 bg-transparent hover:bg-muted/30 transition-colors flex items-center justify-center cursor-pointer min-h-[120px]">
          <CardContent className="p-6 text-center w-full">
            <Button variant="ghost" className="w-full h-full text-muted-foreground hover:text-primary hover:bg-transparent">
              Discover Services to Review
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review._id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link href={`/services/${review.serviceId?._id}`} className="hover:text-primary transition-colors">
                        <h3 className="font-bold text-lg">{review.serviceId?.title || 'Service'}</h3>
                      </Link>
                      <p className="text-sm text-muted">Provided by: <span className="font-medium text-foreground">{review.serviceId?.provider?.name || 'Provider'}</span></p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 my-3 bg-muted/30 w-fit px-3 py-1.5 rounded-full">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-xs font-semibold">{review.rating}.0</span>
                  </div>
                  
                  <div className="bg-muted/20 p-4 rounded-xl border border-muted/50 relative mt-4">
                    <div className="absolute -top-3 left-6 text-4xl text-primary/20 font-serif leading-none">"</div>
                    <p className="text-foreground relative z-10">{review.comment}</p>
                  </div>
                  
                  {review.reply && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10 ml-6 relative">
                      <div className="absolute -left-3 top-4 w-6 h-[1px] bg-primary/20"></div>
                      <div className="absolute -left-3 top-4 w-[1px] h-full bg-primary/20 -mt-px -z-10"></div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Provider's Reply</p>
                      <p className="text-sm text-foreground">{review.reply}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs text-muted-foreground flex items-center">
                    Posted on {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {reviews.length === 0 && (
          <div className="text-center p-10 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">You haven't written any reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
