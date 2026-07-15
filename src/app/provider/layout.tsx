'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LayoutDashboard, Calendar, PlusCircle, Briefcase, DollarSign, Star, User } from 'lucide-react';

const PROVIDER_SIDEBAR_ITEMS = [
  { name: 'Dashboard', href: '/provider/dashboard', icon: LayoutDashboard },
  { name: 'My Services', href: '/provider/services/manage', icon: Briefcase },
  { name: 'Add Service', href: '/provider/services/add', icon: PlusCircle },
  { name: 'Bookings', href: '/provider/bookings', icon: Calendar },
  { name: 'Earnings', href: '/provider/earnings', icon: DollarSign },
  { name: 'Reviews', href: '/provider/reviews', icon: Star },
  { name: 'Profile', href: '/provider/profile', icon: User },
];

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout sidebarItems={PROVIDER_SIDEBAR_ITEMS} sidebarTitle="Provider Menu">
      {children}
    </DashboardLayout>
  );
}
