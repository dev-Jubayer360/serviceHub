'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function BookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        if (res.data.success) {
          setBookings(res.data.data);
        } else {
          setError(res.data.message || 'Failed to fetch bookings');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching bookings');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchBookings();
    }
  }, [user, authLoading]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-500 text-white border-green-500">Completed</span>;
      case 'cancelled': return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-500 text-white border-red-500">Cancelled</span>;
      case 'accepted': return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-500 text-white border-blue-500">Accepted</span>;
      default: return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 border-yellow-200">Pending</span>;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
        <p className="text-muted mt-1">View and manage all your service bookings.</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {bookings.length === 0 && !error ? (
        <Card className="text-center py-12 border-dashed border-2">
          <CardContent>
            <Calendar className="h-16 w-16 mx-auto text-muted mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No Bookings Yet</h3>
            <p className="text-muted mb-6">You haven't booked any services yet.</p>
            <Link href="/services">
              <Button>Browse Services</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking._id} className="hover:border-primary/50 transition-colors overflow-hidden group">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 h-48 md:h-auto bg-muted relative">
                  {booking.service?.image ? (
                    <img 
                      src={booking.service.image} 
                      alt={booking.service.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <Calendar className="h-10 w-10 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 md:hidden">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
                
                <CardContent className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link href={`/services/${booking.service?._id}`} className="hover:text-primary transition-colors">
                          <h3 className="text-xl font-bold line-clamp-1">{booking.service?.title || 'Unknown Service'}</h3>
                        </Link>
                        <p className="text-sm text-muted">Booking #{booking._id.substring(0, 8).toUpperCase()}</p>
                      </div>
                      <div className="hidden md:block">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        {booking.time || 'Time Not Specified'}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground sm:col-span-2">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span className="line-clamp-1">
                          {booking.address ? `${booking.address.street}, ${booking.address.city}` : 'Address not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="font-bold text-lg text-foreground">
                      ৳{booking.totalAmount}
                    </div>
                    <Link href={`/dashboard/bookings/${booking._id}`}>
                      <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
