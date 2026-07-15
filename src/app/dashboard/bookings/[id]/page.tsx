'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, User, CheckCircle, Star, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Review state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/bookings/${id}`);
        if (res.data.success) {
          setBooking(res.data.data);
        }
      } catch (err: any) {
        console.error('Error fetching booking:', err);
        setError(err.response?.data?.message || 'Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchBookingDetails();
    }
  }, [id, user, authLoading]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-green-500 text-white border-green-500">Completed</span>;
      case 'cancelled': return <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-red-500 text-white border-red-500">Cancelled</span>;
      case 'accepted': return <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-blue-500 text-white border-blue-500">Accepted</span>;
      default: return <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-800 border-yellow-200">Pending</span>;
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await api.post(`/services/${booking.service._id}/reviews`, {
        rating,
        comment
      });
      
      if (res.data.success) {
        toast.success('Review submitted successfully!');
        setReviewSubmitted(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
      if (err.response?.data?.message?.toLowerCase().includes('already reviewed')) {
        setReviewSubmitted(true);
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <div className="bg-destructive/10 text-destructive p-6 rounded-2xl mb-6">
          <h2 className="text-xl font-bold mb-2">Oops!</h2>
          <p>{error || 'Booking not found'}</p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const isCustomer = user?.role === 'customer';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order Details</h1>
            <p className="text-muted text-sm">#{booking._id.toUpperCase()}</p>
          </div>
        </div>
        <div>
          {getStatusBadge(booking.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-lg">Service Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/3 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {booking.service?.image ? (
                    <img src={booking.service.image} alt={booking.service.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{booking.service?.title || 'Unknown Service'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      {booking.timeSlot || booking.time || 'Not specified'}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground sm:col-span-2">
                      <MapPin className="h-4 w-4 mr-2 text-primary shrink-0" />
                      <span>
                        {booking.address ? `${booking.address.street}, ${booking.address.city}` : 'No address provided'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave a Review Section (Only if completed & customer) */}
          {booking.status === 'completed' && isCustomer && !reviewSubmitted && (
            <Card className="border-primary/20 shadow-sm rounded-2xl overflow-hidden bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <Star className="w-5 h-5 fill-current" /> Leave a Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Rate your experience</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              (hoverRating || rating) >= star 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            } transition-colors`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Tell us more</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="How was the service? Would you recommend this provider?"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
                    ></textarea>
                  </div>
                  <Button type="submit" disabled={isSubmittingReview || rating === 0 || !comment.trim()} className="w-full sm:w-auto">
                    {isSubmittingReview ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Review Thanks */}
          {booking.status === 'completed' && isCustomer && reviewSubmitted && (
            <Card className="border-green-200 shadow-sm rounded-2xl bg-green-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Thank you for your feedback!</h3>
                <p className="text-green-600">Your review helps other users find great services.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Details */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Service Price</span>
                <span className="font-medium">৳{booking.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border pb-4">
                <span className="text-muted-foreground">Platform Fee</span>
                <span className="font-medium">৳0</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-primary">৳{booking.totalAmount}</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium mb-2 text-foreground">Payment Details</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4 mr-2" /> 
                    Method: {booking.paymentMethod || 'bKash'}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2" /> 
                    Status: <span className="capitalize ml-1 font-medium">{booking.paymentStatus || 'Pending'}</span>
                  </div>
                  {booking.transactionId && (
                    <div className="flex items-start text-sm text-muted-foreground">
                      <span className="font-medium mr-1">TrxID:</span> {booking.transactionId}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-lg">
                {isCustomer ? 'Provider Details' : 'Customer Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {(() => {
                const person = isCustomer ? booking.provider : booking.customer;
                if (!person) return <p className="text-muted text-sm">Details unavailable</p>;
                
                return (
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                      {person.image ? (
                        <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                      ) : (
                        person.name?.charAt(0).toUpperCase() || <User className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{person.name}</h4>
                      {person.phone && <p className="text-xs text-muted-foreground mt-0.5">{person.phone}</p>}
                      <p className="text-xs text-muted-foreground line-clamp-1">{person.email}</p>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
