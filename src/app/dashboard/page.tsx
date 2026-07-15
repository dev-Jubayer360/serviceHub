'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { Calendar, CheckCircle, Clock, CreditCard, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CustomerDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'customer') {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/user/dashboard-stats'),
          api.get('/bookings/my-bookings')
        ]);
        
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, authLoading, router]);

  if (authLoading || isLoading) return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-primary/5 p-6 rounded-2xl border border-primary/10">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-muted mt-1">You have {stats?.pendingBookings || 0} pending bookings.</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/services')}>Book a Service</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <StatCard icon={Calendar} label="Total Bookings" value={stats?.totalBookings || 0} />
        <StatCard icon={CheckCircle} label="Completed" value={stats?.completedBookings || 0} iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={Clock} label="Pending" value={stats?.pendingBookings || 0} iconBgColor="bg-orange-100" iconColor="text-orange-600" />
        <StatCard icon={CreditCard} label="Total Spent" value={`৳${stats?.totalSpent?.toLocaleString() || 0}`} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Bookings */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 {bookings.slice(0, 3).map((booking: any) => (
                   <div key={booking._id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border bg-background/50">
                     <div className="w-16 h-16 bg-muted/20 rounded-lg overflow-hidden shrink-0">
                       <img src={booking.service?.image || booking.service?.images?.[0] || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=100&auto=format&fit=crop"} className="w-full h-full object-cover" alt="Service" />
                     </div>
                     <div className="flex-1">
                       <div className="flex justify-between items-start">
                         <h4 className="font-semibold text-foreground">{booking.service?.title || 'Service'}</h4>
                         <Badge variant={booking.status === 'pending' ? 'accent' : booking.status === 'completed' ? 'secondary' : 'outline'}>
                           {booking.status}
                         </Badge>
                       </div>
                       <p className="text-sm text-muted mb-2">{booking.provider?.name || 'Provider'}</p>
                       <div className="flex items-center gap-4 text-xs text-muted font-medium">
                         <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.scheduledDate).toLocaleDateString()}</span>
                         <span>৳{booking.totalAmount}</span>
                       </div>
                     </div>
                   </div>
                 ))}
                 {bookings.length === 0 && <p className="text-muted text-sm py-4">No recent bookings found.</p>}
               </div>
            </CardContent>
          </Card>

          {/* Booking History Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking History</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="overflow-x-auto w-full">
                 <table className="w-full text-sm text-left min-w-[500px]">
                   <thead className="text-xs text-muted uppercase bg-muted/5 border-y border-border">
                     <tr>
                       <th className="px-4 py-3 font-medium">Service</th>
                       <th className="px-4 py-3 font-medium">Date</th>
                       <th className="px-4 py-3 font-medium">Amount</th>
                       <th className="px-4 py-3 font-medium">Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     {bookings.map((booking: any) => (
                       <tr key={booking._id} className="border-b border-border hover:bg-muted/5 transition-colors">
                         <td className="px-4 py-4 font-medium text-foreground">{booking.service?.title}</td>
                         <td className="px-4 py-4 text-muted">{new Date(booking.createdAt).toLocaleDateString()}</td>
                         <td className="px-4 py-4 font-medium">৳{booking.totalAmount}</td>
                         <td className="px-4 py-4">
                           <Badge variant={booking.status === 'pending' ? 'accent' : booking.status === 'completed' ? 'secondary' : 'outline'}>
                             {booking.status}
                           </Badge>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Area */}
        <div className="space-y-6">
          {/* Profile Quick Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden">
                {user?.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name.charAt(0)
                )}
              </div>
              <h3 className="font-bold text-foreground">{user?.name}</h3>
              <p className="text-sm text-muted mb-4">{user?.email}</p>
              <Button variant="outline" fullWidth size="sm" onClick={() => router.push('/profile')}>Edit Profile</Button>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
