'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/shared/StatCard';
import { DollarSign, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function EarningsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<any>(null);
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'provider') {
      router.push('/login');
      return;
    }

    const fetchEarningsData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/user/dashboard-stats'),
          api.get('/bookings/provider-bookings')
        ]);
        
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (bookingsRes.data.success) {
          // Filter only completed bookings for earnings
          const completed = bookingsRes.data.data.filter((b: any) => b.status === 'completed');
          setCompletedBookings(completed);
        }
      } catch (error) {
        console.error('Failed to fetch earnings', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEarningsData();
  }, [user, authLoading, router]);

  if (authLoading || isLoading) return <div className="p-10 text-center">Loading earnings...</div>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Earnings Overview</h1>
        <p className="text-muted mt-1">Track your completed jobs and total revenue.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard 
          icon={DollarSign} 
          label="Total Earnings" 
          value={`৳${stats?.totalEarnings?.toLocaleString() || 0}`} 
          iconBgColor="bg-green-100" 
          iconColor="text-green-600" 
        />
        <StatCard 
          icon={CheckCircle} 
          label="Completed Jobs" 
          value={stats?.completedBookings || 0} 
          iconBgColor="bg-blue-100" 
          iconColor="text-blue-600" 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left border-collapse min-w-[600px]">
              <thead className="text-xs text-muted uppercase bg-muted/5 border-y border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Date Completed</th>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium text-right">Amount Earned</th>
                </tr>
              </thead>
              <tbody>
                {completedBookings.map(booking => (
                  <tr key={booking._id} className="border-b border-border hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4 text-muted">
                      {new Date(booking.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {booking.service?.title}
                    </td>
                    <td className="px-6 py-4">
                      {booking.customer?.name}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      +৳{booking.totalAmount}
                    </td>
                  </tr>
                ))}
                {completedBookings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-muted">
                      No earnings history yet. Complete jobs to see your earnings here.
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
