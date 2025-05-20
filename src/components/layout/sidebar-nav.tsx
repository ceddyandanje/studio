
"use client";

import React from "react";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Sparkles,
  Activity, // Icon for Overview page (Upcoming View)
  ChevronDown,
  ListTodo, 
  CheckCircle2, 
} from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import type { LucideIcon } from 'lucide-react';

interface NavItemConfig {
  href?: string; 
  label: string;
  icon: LucideIcon;
  children?: NavChildItemConfig[];
  basePath?: string; // For parent active state if href is not direct
}

interface NavChildItemConfig {
  href: string;
  label: string;
  icon?: LucideIcon; 
  statusQuery?: string; 
}

const navItemsConfig: NavItemConfig[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    basePath: '/', // To make parent active for both '/' and '/overview'
    children: [
      { href: '/', label: 'Main Dashboard', icon: LayoutDashboard },
      { href: '/overview', label: 'Upcoming View', icon: Activity },
    ],
  },
  {
    label: 'Tasks',
    icon: ListChecks,
    basePath: '/tasks',
    children: [
      { href: '/tasks', label: 'All Tasks', icon: ListChecks },
      { href: '/tasks?status=pending', label: 'Pending', icon: ListTodo, statusQuery: 'pending' },
      { href: '/tasks?status=completed', label: 'Completed', icon: CheckCircle2, statusQuery: 'completed' },
    ],
  },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/schedule', label: 'AI Scheduler', icon: Sparkles },
];


export function SidebarNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openSubMenus, setOpenSubMenus] = React.useState<Record<string, boolean>>(() => {
    // Initialize open states based on current path
    const initialStates: Record<string, boolean> = {};
    navItemsConfig.forEach(item => {
      if (item.children && item.basePath && pathname.startsWith(item.basePath)) {
        initialStates[item.label] = true;
      }
    });
    return initialStates;
  });

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <nav
      className={cn(
        "flex flex-col gap-0.5",
        className
      )}
      {...props}
    >
      <SidebarMenu>
        {navItemsConfig.map((item) => {
          if (item.children) {
            const isOpen = openSubMenus[item.label] || false;
            const isParentActive = item.basePath ? pathname.startsWith(item.basePath) : false;

            return (
              <React.Fragment key={item.label}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isParentActive && !item.children.some(c => c.href === pathname)} // Parent active if base path matches AND not a direct child link
                    tooltip={item.label}
                    onClick={() => toggleSubMenu(item.label)}
                    className={cn(
                      (isParentActive && !isOpen && !item.children.some(c => c.href === pathname && (!c.statusQuery && !searchParams.get('status') || c.statusQuery === searchParams.get('status'))))
                        ? 'bg-primary/10 text-primary hover:bg-primary/20' // Style for active parent when closed and not a direct child match
                        : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground',
                      'justify-start'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 ml-auto transition-transform group-data-[collapsible=icon]:hidden",
                      isOpen ? "rotate-180" : ""
                    )} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isOpen && (
                  <SidebarMenuSub> 
                    {item.children.map(child => {
                      let childIsActive = false;
                      if (child.statusQuery) {
                        childIsActive = pathname === child.href.split('?')[0] && searchParams.get('status') === child.statusQuery;
                      } else {
                        childIsActive = pathname === child.href && (item.label !== 'Tasks' || !searchParams.get('status'));
                      }

                      return (
                        <SidebarMenuSubItem key={child.href + (child.statusQuery || '')}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={childIsActive}
                          >
                            <Link href={child.href}>
                              {child.icon && <child.icon className="mr-2 h-4 w-4 flex-shrink-0" />}
                              {child.label}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                )}
              </React.Fragment>
            );
          } else {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(
                     isActive
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground',
                     'justify-start'
                  )}
                >
                  <Link href={item.href!}>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </nav>
  );
}
