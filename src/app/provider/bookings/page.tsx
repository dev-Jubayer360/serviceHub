'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProviderBookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'provider') {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/provider-bookings');
        if (res.data.success) {
          setBookings(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [user, authLoading, router]);

  const handleUpdateBookingStatus = async (id: string, updates: any) => {
    try {
      const res = await api.put(`/bookings/${id}/status`, updates);
      if (res.data.success) {
        setBookings(bookings.map(b => b._id === id ? { ...b, ...updates } : b));
        toast.success(`Booking updated successfully`);
      }
    } catch (error: any) {
      console.error('Error updating booking', error);
      toast.error(error.response?.data?.message || 'Failed to update booking');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  if (authLoading || isLoading) return <div className="p-10 text-center">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Bookings</h1>
          <p className="text-muted mt-1">View and update the status of your service requests.</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
            <Button
              key={f}
              variant={filter === f ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left border-collapse min-w-[800px]">
              <thead className="text-xs text-muted uppercase bg-muted/5 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer Details</th>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Schedule</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking._id} className="border-b border-border hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{booking.customer?.name}</div>
                      <div className="text-xs text-muted mb-1">{booking.customer?.email}</div>
                      <div className="text-xs text-muted">{booking.address?.addressLine1}, {booking.address?.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{booking.service?.title}</div>
                      <div className="text-xs text-muted">ID: {booking._id.slice(-6).toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      <div className="font-medium text-foreground">{new Date(booking.scheduledDate).toLocaleDateString()}</div>
                      <div className="text-xs">{booking.scheduledTime || 'Flexible'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">৳{booking.totalAmount}</div>
                      {booking.transactionId && (
                        <div className="text-xs font-mono text-muted mt-1 bg-muted/20 inline-block px-1 rounded border border-border/50">TrxID: {booking.transactionId}</div>
                      )}
                      <div className="text-[10px] uppercase font-bold mt-1 text-muted-foreground">{booking.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        booking.status === 'pending' ? 'accent' : 
                        booking.status === 'completed' ? 'secondary' : 
                        booking.status === 'cancelled' ? 'destructive' : 'outline'
                      }>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {booking.status === 'pending' && (
                        <div className="flex justify-end gap-2 flex-col items-end">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-green-500 text-green-500 hover:bg-green-50" onClick={() => handleUpdateBookingStatus(booking._id, { status: 'confirmed' })}>
                              <CheckCircle className="w-4 h-4 mr-1" /> Accept Order
                            </Button>
                            <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50" onClick={() => handleUpdateBookingStatus(booking._id, { status: 'cancelled' })}>
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </div>
                          
                          {booking.paymentStatus === 'pending' && booking.transactionId && (
                            <Button variant="outline" size="sm" className="mt-2 text-xs border-blue-500 text-blue-600 hover:bg-blue-50" onClick={() => handleUpdateBookingStatus(booking._id, { paymentStatus: 'paid' })}>
                              <CheckCircle className="w-3 h-3 mr-1" /> Confirm Payment
                            </Button>
                          )}
                        </div>
                      )}
                      {booking.status === 'confirmed' && (
                        <div className="flex flex-col items-end gap-2">
                          <Button variant="primary" size="sm" onClick={() => handleUpdateBookingStatus(booking._id, { status: 'completed' })}>
                            Mark as Completed
                          </Button>
                          {booking.paymentStatus === 'pending' && booking.transactionId && (
                            <Button variant="outline" size="sm" className="text-xs border-blue-500 text-blue-600 hover:bg-blue-50" onClick={() => handleUpdateBookingStatus(booking._id, { paymentStatus: 'paid' })}>
                              <CheckCircle className="w-3 h-3 mr-1" /> Confirm Payment
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted">
                      No bookings found for the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
