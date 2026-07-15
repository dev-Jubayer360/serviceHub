'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, FileText, TrendingUp, Users } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Reports</h1>
          <p className="text-muted mt-1">Generate and download detailed analytics reports.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" disabled>
          <Download className="w-4 h-4" /> Export All Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <CardTitle>Financial Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted mb-4">Detailed breakdown of platform revenue, provider payouts, and transaction history.</p>
            <Button variant="outline" className="w-full">Generate CSV</Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <CardTitle>Booking Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted mb-4">Comprehensive data on booking volume, completion rates, and service popularity.</p>
            <Button variant="outline" className="w-full">Generate CSV</Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader>
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted mb-4">Statistics on new customer registrations, provider onboarding, and active users.</p>
            <Button variant="outline" className="w-full">Generate CSV</Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
         <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="text-center py-12 text-muted">
               <p>No recently generated reports.</p>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
