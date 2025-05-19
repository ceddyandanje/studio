"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Sparkles,
  Settings,
} from 'lucide-react';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  isMobile?: boolean;
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/schedule', label: 'AI Scheduler', icon: Sparkles },
];

export function SidebarNav({ className, isMobile = false, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex flex-col gap-2",
        isMobile ? "p-4" : "p-2",
        className
      )}
      {...props}
    >
      {isMobile && (
         <Link href="/" className="flex items-center gap-2 p-4 font-semibold text-primary">
           <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path fill="currentColor" d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm0 72c-17.7 0-32-14.3-32-32S32.3 18 50 18s32 14.3 32 32-14.3 32-32 32z"/>
            <path fill="currentColor" d="M53 25h-6v25l21.6 12.9 3-4.9-18.6-11V25z"/>
           </svg>
          ChronoFlow
        </Link>
      )}
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: pathname === item.href ? 'default' : 'ghost', size: 'default' }),
            'justify-start gap-2 text-md',
            pathname === item.href ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-muted/50'
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
