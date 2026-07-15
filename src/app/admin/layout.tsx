'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LayoutDashboard, Users, UserCheck, Briefcase, Calendar, Star, Settings, FileText, List } from 'lucide-react';

const ADMIN_SIDEBAR_ITEMS = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Providers', href: '/admin/providers', icon: UserCheck },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Categories', href: '/admin/categories', icon: List },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout sidebarItems={ADMIN_SIDEBAR_ITEMS} sidebarTitle="Admin Control">
      {children}
    </DashboardLayout>
  );
}
