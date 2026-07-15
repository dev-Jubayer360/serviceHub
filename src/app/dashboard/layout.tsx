'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LayoutDashboard, Calendar, Heart, MessageSquare, Star, CreditCard, User } from 'lucide-react';

const CUSTOMER_SIDEBAR_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Favourites', href: '/dashboard/favourites', icon: Heart },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout sidebarItems={CUSTOMER_SIDEBAR_ITEMS} sidebarTitle="Customer Menu">
      {children}
    </DashboardLayout>
  );
}
