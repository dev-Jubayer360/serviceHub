'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/shared/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DollarSign, Calendar, TrendingUp, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ProviderDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'provider') {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [statsRes, bookingsRes, servicesRes] = await Promise.all([
          api.get('/user/dashboard-stats'),
          api.get('/bookings/provider-bookings'),
          api.get(`/services?providerId=${user._id}`)
        ]);
        
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
        if (servicesRes.data.success) setServices(servicesRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, authLoading, router]);

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await api.put(`/bookings/${id}/status`, { status });
      if (res.data.success) {
        setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
      }
    } catch (error) {
      console.error('Error updating booking status', error);
    }
  };

  if (authLoading || isLoading) return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Provider Overview</h1>
        <p className="text-muted mt-1">Here is what's happening with your business today, {user?.name}.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <StatCard icon={DollarSign} label="Total Earnings" value={`৳${stats?.totalEarnings?.toLocaleString() || 0}`} iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={TrendingUp} label="Pending Bookings" value={stats?.pendingBookings || 0} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
        <StatCard icon={Calendar} label="Total Jobs" value={stats?.totalBookings || 0} />
        <StatCard icon={Star} label="Average Rating" value={user?.rating || 'New'} iconBgColor="bg-accent/10" iconColor="text-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Charts Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted/10 rounded-xl border border-border flex items-center justify-center">
                 {/* In a real app, integrate Recharts here */}
                 <p className="text-muted font-medium">Monthly Revenue Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings Table */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
               <div className="overflow-x-auto w-full">
                 <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                   <thead className="text-xs text-muted uppercase bg-muted/5 border-y border-border">
                     <tr>
                       <th className="px-4 py-3 font-medium">Customer</th>
                       <th className="px-4 py-3 font-medium">Service</th>
                       <th className="px-4 py-3 font-medium">Amount</th>
                       <th className="px-4 py-3 font-medium">Status</th>
                       <th className="px-4 py-3 font-medium">Action</th>
                     </tr>
                   </thead>
                   <tbody>
                     {bookings.slice(0, 5).map((booking: any) => (
                       <tr key={booking._id} className="border-b border-border hover:bg-muted/5 transition-colors">
                         <td className="px-4 py-3">
                           <div className="font-semibold text-foreground">{booking.customer?.name}</div>
                           <div className="text-xs text-muted">{booking.customer?.email}</div>
                         </td>
                         <td className="px-4 py-3 font-medium text-foreground">{booking.service?.title}</td>
                         <td className="px-4 py-3 text-muted">{new Date(booking.scheduledDate).toLocaleDateString()}</td>
                         <td className="px-4 py-3">
                           <Badge variant={booking.status === 'pending' ? 'accent' : booking.status === 'completed' ? 'secondary' : 'outline'}>
                             {booking.status}
                           </Badge>
                         </td>
                         <td className="px-4 py-3 text-right">
                           {booking.status === 'pending' && (
                             <>
                               <Button variant="outline" size="sm" className="mr-2 border-green-500 text-green-500 hover:bg-green-50" onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}>Accept</Button>
                               <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50" onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}>Reject</Button>
                             </>
                           )}
                           {booking.status === 'confirmed' && (
                             <Button variant="primary" size="sm" onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}>Complete</Button>
                           )}
                         </td>
                       </tr>
                     ))}
                     {bookings.length === 0 && (
                       <tr>
                         <td colSpan={5} className="px-4 py-4 text-center text-muted">No recent bookings.</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Area */}
        <div className="space-y-6">
          {/* Active Services Quick view */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Services</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {services.slice(0, 3).map((service: any) => (
                     <div key={service._id} className="flex items-center justify-between p-3 border border-border rounded-xl">
                       <div>
                         <h4 className="text-sm font-semibold text-foreground truncate w-32" title={service.title}>{service.title}</h4>
                         <p className="text-xs text-muted font-medium">৳{service.price} {service.pricingType === 'hourly' ? '/ hr' : ''}</p>
                       </div>
                       <Badge variant={service.isActive ? "secondary" : "outline"}>{service.isActive ? 'Active' : 'Inactive'}</Badge>
                     </div>
                  ))}
                  {services.length === 0 && <p className="text-muted text-sm">No services listed yet.</p>}
               </div>
               <Button variant="outline" fullWidth size="sm" className="mt-4" onClick={() => router.push('/provider/services/manage')}>Manage Services</Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
