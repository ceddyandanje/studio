
"use client";

import React from "react"; // Corrected React import
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Sparkles,
  Activity,
  ChevronDown,
  ListTodo, // Icon for Pending Tasks
  CheckCircle2, // Icon for Completed Tasks
} from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href?: string; // Optional for parent items
  label: string;
  icon: LucideIcon;
  children?: NavChildItem[];
}

interface NavChildItem {
  href: string;
  label: string;
  icon?: LucideIcon; // Optional for sub-items, or use a default
  statusQuery?: string; // e.g., "pending" or "completed" for tasks
}

const navItemsConfig: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/overview', label: 'Overview', icon: Activity },
  {
    label: 'Tasks',
    icon: ListChecks,
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
  const [openSubMenus, setOpenSubMenus] = React.useState<Record<string, boolean>>({});

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
            // Parent is active if current path starts with the base path of its children (e.g., /tasks)
            const baseChildPath = item.children[0].href.split('?')[0];
            const isParentActive = pathname.startsWith(baseChildPath);

            return (
              <React.Fragment key={item.label}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isParentActive}
                    tooltip={item.label}
                    onClick={() => toggleSubMenu(item.label)}
                    className={cn(
                      isParentActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground' // Active parent style
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
                  <SidebarMenuSub> {/* SidebarMenuSub handles group-data-[collapsible=icon]:hidden */}
                    {item.children.map(child => {
                      let childIsActive = false;
                      if (child.statusQuery) {
                        childIsActive = pathname === child.href.split('?')[0] && searchParams.get('status') === child.statusQuery;
                      } else {
                        // For "All Tasks" or items without specific query params
                        childIsActive = pathname === child.href && !searchParams.get('status');
                      }

                      return (
                        <SidebarMenuSubItem key={child.href}>
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
            // Regular item rendering (item.href will exist here)
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
