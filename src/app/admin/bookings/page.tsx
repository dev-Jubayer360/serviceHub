'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loader2, Search, Filter } from 'lucide-react';
import api from '@/lib/api';
import { Input } from '@/components/ui/Input';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.data);
    } catch (err: any) {
      setError('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: newStatus });
      fetchBookings(); // Refresh data
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b._id && b._id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.customer?.name && b.customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.provider?.name && b.provider.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Bookings</h1>
          <p className="text-muted mt-1">View and manage all service bookings across the platform.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>All Bookings</CardTitle>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
             <div className="relative">
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
               <select 
                 className="w-full sm:w-auto pl-9 pr-8 py-2.5 rounded-xl border border-border bg-background outline-none text-sm appearance-none"
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value)}
               >
                 <option value="All">All Statuses</option>
                 <option value="Pending">Pending</option>
                 <option value="Accepted">Accepted</option>
                 <option value="In Progress">In Progress</option>
                 <option value="Completed">Completed</option>
                 <option value="Cancelled">Cancelled</option>
               </select>
             </div>
             <div className="w-full sm:w-64">
               <Input 
                 placeholder="Search by ID or name..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 icon={<Search className="w-4 h-4" />}
               />
             </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
                <thead className="text-xs text-muted uppercase bg-muted/5 border-y border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Booking ID & Date</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Provider</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-muted">No bookings found.</td></tr>
                  ) : filteredBookings.map(booking => (
                    <tr key={booking._id} className="border-b border-border hover:bg-muted/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold font-mono text-foreground">#{booking._id.substring(0, 8).toUpperCase()}</div>
                        <div className="text-xs text-muted">{new Date(booking.createdAt).toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{booking.service?.title || 'Deleted Service'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-foreground">{booking.customer?.name}</div>
                        <div className="text-xs text-muted">{booking.customer?.phone || booking.customer?.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-foreground">{booking.provider?.name || 'Unassigned'}</div>
                        {booking.provider && <div className="text-xs text-muted">{booking.provider?.phone}</div>}
                      </td>
                      <td className="px-4 py-3 font-bold text-foreground">
                        ৳{booking.totalAmount}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          booking.status === 'completed' ? 'success' : 
                          booking.status === 'cancelled' ? 'destructive' : 
                          booking.status === 'pending' ? 'accent' : 'primary'
                        }>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {booking.status === 'pending' || booking.status === 'accepted' ? (
                           <select 
                             className="text-xs border border-border rounded p-1 bg-background"
                             value={booking.status}
                             onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                           >
                             <option value="pending" disabled>Pending</option>
                             <option value="accepted">Accept</option>
                             <option value="in_progress">Start Job</option>
                             <option value="completed">Complete</option>
                             <option value="cancelled">Cancel</option>
                           </select>
                        ) : (
                          <span className="text-xs text-muted italic">Finalized</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
