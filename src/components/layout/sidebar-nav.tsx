
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Sparkles,
  Settings,
  Activity, // Added for Overview
} from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  isMobile?: boolean; // This prop might become less relevant if ui/sidebar handles mobile
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/overview', label: 'Overview', icon: Activity },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/schedule', label: 'AI Scheduler', icon: Sparkles },
];

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex flex-col gap-0.5", // Reduced gap for tighter menu items
        className
      )}
      {...props}
    >
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
              className={cn(
                 pathname === item.href 
                  ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                  : 'hover:bg-muted/50 text-sidebar-foreground',
                 'justify-start'
              )}
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  );
}
