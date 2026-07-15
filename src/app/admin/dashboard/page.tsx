'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/shared/StatCard';
import { Users, UserCheck, Briefcase, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import api from '@/lib/api';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats');
        setStats(res.data.data);
      } catch (err: any) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
          <p className="text-muted mt-1">Platform wide statistics and recent activities.</p>
        </div>
        <Link href="/admin/users">
          <Button variant="primary" className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Manage Users
          </Button>
        </Link>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers.toString()} />
        <StatCard icon={UserCheck} label="Providers" value={stats.totalProviders.toString()} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
        <StatCard icon={Briefcase} label="Services" value={stats.totalServices.toString()} iconBgColor="bg-orange-100" iconColor="text-orange-600" />
        <StatCard icon={Calendar} label="Total Bookings" value={stats.totalBookings.toString()} iconBgColor="bg-purple-100" iconColor="text-purple-600" />
        <StatCard icon={DollarSign} label="Revenue" value={`৳${stats.totalRevenue.toLocaleString()}`} iconBgColor="bg-green-100" iconColor="text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">

          {/* Charts Area Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.bookingAnalytics || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar yAxisId="left" dataKey="bookings" name="Bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar yAxisId="right" dataKey="revenue" name="Revenue (৳)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.userGrowth || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="users" name="New Users" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

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
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Service</th>
                      <th className="px-4 py-3 font-medium">Provider</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-4 text-muted">No recent bookings</td></tr>
                    )}
                    {stats.recentBookings.map((booking: any) => (
                      <tr key={booking._id} className="border-b border-border hover:bg-muted/5 transition-colors">
                        <td className="px-4 py-3 font-medium">#{booking._id.substring(0, 8).toUpperCase()}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{booking.service?.title || 'Unknown Service'}</td>
                        <td className="px-4 py-3 text-muted">{booking.provider?.name || 'Unassigned'}</td>
                        <td className="px-4 py-3 text-muted">{booking.customer?.name}</td>
                        <td className="px-4 py-3 font-bold text-foreground">৳{booking.totalAmount}</td>
                        <td className="px-4 py-3">
                          <Badge variant={booking.status === 'completed' ? 'default' : booking.status === 'cancelled' ? 'secondary' : 'accent'}>
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

          {/* Top Providers Table (Placeholder logic for now) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Providers</CardTitle>
            </CardHeader>
            <CardContent>
                {stats.topProviders?.map((provider: any) => (
                  <Link key={provider._id} href={`/provider/${provider._id}`}>
                    <div className="flex items-center gap-3 p-3 border border-border rounded-xl hover:bg-muted/5 transition-colors cursor-pointer mb-3">
                      <img src={provider.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop'} className="w-10 h-10 rounded-full object-cover" alt={provider.name} />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-foreground">{provider.name}</h4>
                        <p className="text-xs text-muted font-medium">{provider.completedJobs || 0} Jobs Completed</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-foreground">{provider.rating > 0 ? provider.rating.toFixed(1) : 'New'}</div>
                        <div className="text-xs text-muted">Rating</div>
                      </div>
                    </div>
                  </Link>
                ))}
                {(!stats.topProviders || stats.topProviders.length === 0) && (
                  <div className="text-center text-sm text-muted py-4">
                    No providers available.
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {stats.recentActivities.map((activity: any, i: number) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className={`w-2 h-2 rounded-full ${activity.color}`}></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-white shadow-sm">
                      <h4 className="text-sm font-semibold text-foreground mb-1">{activity.title}</h4>
                      <p className="text-xs text-muted font-medium">{new Date(activity.time).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
