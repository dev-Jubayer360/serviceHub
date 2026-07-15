'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon, Home } from 'lucide-react';

export interface SidebarItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
}

export const Sidebar = ({ items, title }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-border h-full flex flex-col hidden md:flex shrink-0">
      <div className="p-6 flex-1 overflow-y-auto">
        <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-xl font-bold text-xl">
            S
          </div>
          <span className="text-xl font-bold text-primary">ServiceHub</span>
        </Link>
        {title && <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">{title}</h2>}
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:bg-muted/10 hover:text-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Bottom section */}
      <div className="p-4 border-t border-border">
         <Link 
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-muted hover:bg-muted/10 hover:text-foreground"
         >
            <Home className="w-5 h-5 text-muted" />
            Back to Website
         </Link>
      </div>
    </aside>
  );
};
