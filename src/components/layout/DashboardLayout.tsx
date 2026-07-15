'use client';

import React, { useState } from 'react';
import { Sidebar, SidebarItem } from './Sidebar';
import { Menu, Bell, User, Search, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  sidebarTitle?: string;
}

export const DashboardLayout = ({ children, sidebarItems, sidebarTitle }: DashboardLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar items={sidebarItems} title={sidebarTitle} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden p-2 text-muted hover:bg-muted/10 rounded-md"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center bg-background border border-border rounded-xl px-3 py-2 w-96">
              <Search className="w-4 h-4 text-muted mr-2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted hover:bg-muted/10 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)}></div>
          <div className="relative w-64 bg-white h-full flex flex-col">
             <div className="p-6 flex-1 overflow-y-auto">
               <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-xl font-bold text-xl">
                  S
                </div>
                <span className="text-xl font-bold text-primary">ServiceHub</span>
              </Link>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                   <Link
                   key={item.name}
                   href={item.href}
                   onClick={() => setIsMobileSidebarOpen(false)}
                   className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-muted hover:bg-muted/10 hover:text-foreground"
                 >
                   <item.icon className="w-5 h-5 text-muted" />
                   {item.name}
                 </Link>
                ))}
              </nav>
             </div>
             {/* Bottom section */}
             <div className="p-4 border-t border-border">
                <Link 
                   href="/"
                   onClick={() => setIsMobileSidebarOpen(false)}
                   className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-muted hover:bg-muted/10 hover:text-foreground"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-muted"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                   Back to Website
                </Link>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
