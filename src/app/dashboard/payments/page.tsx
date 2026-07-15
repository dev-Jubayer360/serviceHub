'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download, CreditCard, ArrowUpRight, Search, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function PaymentsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentsData = async () => {
      if (!user) return;
      try {
        const [bookingsRes, statsRes] = await Promise.all([
          api.get('/bookings/my-bookings'),
          api.get('/user/dashboard-stats')
        ]);
        
        if (bookingsRes.data.success) {
          setPayments(bookingsRes.data.data);
        }
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchPaymentsData();
    }
  }, [user, authLoading]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-500 text-white border-green-500">Successful</span>;
      case 'pending': return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 border-yellow-200">Pending</span>;
      case 'failed': return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-500 text-white border-red-500">Failed</span>;
      default: return <Badge variant="outline">{status}</Badge>;
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
        <h1 className="text-3xl font-bold text-foreground">Payment History</h1>
        <p className="text-muted mt-1">View and download your transaction receipts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium mb-1">Total Spent</p>
                <h3 className="text-3xl font-bold">৳{stats?.totalSpent?.toLocaleString() || 0}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-xs text-primary-foreground/70">In the last 6 months</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <Button variant="outline" className="w-full flex justify-between items-center h-12" disabled>
              Add Payment Method
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b flex justify-between items-center bg-muted/20">
          <h3 className="font-semibold">Recent Transactions</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by ID or service..." 
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Service Info</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, idx) => (
                <tr key={payment._id} className={`border-b border-border/50 hover:bg-muted/10 transition-colors ${idx === payments.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-6 py-4 font-medium text-foreground">{payment._id.substring(0, 10).toUpperCase()}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{payment.service?.title || 'Service'}</p>
                    <p className="text-xs text-muted-foreground">{payment.provider?.name || 'Provider'}</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{payment.paymentMethod || 'Cash'}</td>
                  <td className="px-6 py-4 font-bold text-foreground">৳{payment.totalAmount}</td>
                  <td className="px-6 py-4">{getStatusBadge(payment.paymentStatus || 'pending')}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 text-primary hover:text-primary hover:bg-primary/10">
                      <Download className="h-4 w-4 mr-1.5" />
                      PDF
                    </Button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted-foreground">No recent transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
