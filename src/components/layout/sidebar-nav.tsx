
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
  Activity,
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
  basePath?: string; // Used to keep parent active when a child is active
}

interface NavChildItemConfig {
  href: string;
  label: string;
  icon?: LucideIcon;
  statusQuery?: string; // For task status filtering
}

const navItemsConfig: NavItemConfig[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    basePath: '/', // Matches both / and /overview
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
    const initialStates: Record<string, boolean> = {};
    // Try to open the relevant submenu if a child route is active on initial load
    navItemsConfig.forEach(item => {
      if (item.children && item.basePath) {
        if (pathname.startsWith(item.basePath)) {
          // Check if this is the most specific basePath match or if any child is directly active
          const isDirectChildActive = item.children.some(child => 
             child.statusQuery 
             ? pathname === child.href.split('?')[0] && searchParams.get('status') === child.statusQuery
             : pathname === child.href && (item.label !== 'Tasks' || !searchParams.get('status'))
          );
          if (isDirectChildActive || pathname === item.basePath) { // Open if parent or direct child is active
            initialStates[item.label] = true;
          } else {
             initialStates[item.label] = false;
          }
        } else {
          initialStates[item.label] = false;
        }
      }
    });
     // Ensure only one is open initially if multiple somehow match
    let firstOpen = false;
    for (const key in initialStates) {
        if (initialStates[key]) {
            if (firstOpen) {
                initialStates[key] = false;
            } else {
                firstOpen = true;
            }
        }
    }
    return initialStates;
  });

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus(prevOpenSubMenus => {
      const isCurrentlyOpen = !!prevOpenSubMenus[label];
      const newStates: Record<string, boolean> = {};

      // Close all other submenus, then toggle the clicked one
      navItemsConfig.forEach(configItem => {
        if (configItem.children) {
          if (configItem.label === label) {
            newStates[configItem.label] = !isCurrentlyOpen;
          } else {
            newStates[configItem.label] = false; // Close other dropdowns
          }
        }
      });
      return newStates;
    });
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
            // Parent is active if its basePath matches and no specific child is the *sole* reason for another menu being open,
            // or if one of its children is active.
            const isParentPathActive = item.basePath ? pathname.startsWith(item.basePath) : false;
             const isAnyChildActive = item.children.some(child => 
                child.statusQuery 
                ? pathname === child.href.split('?')[0] && searchParams.get('status') === child.statusQuery
                : pathname === child.href && (item.label !== 'Tasks' || !searchParams.get('status'))
             );

            return (
              <React.Fragment key={item.label}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isParentPathActive && isOpen} // Parent button active if its section is open and path matches
                    tooltip={item.label}
                    onClick={() => toggleSubMenu(item.label)}
                    className={cn(
                      (isParentPathActive && !isAnyChildActive && !isOpen) // Highlight if path matches but not expanded to show a child
                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
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
                
                <div className={cn(
                  "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
                  "group-data-[collapsible=icon]:hidden", // Hide when sidebar is collapsed
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 invisible"
                )}>
                  <SidebarMenuSub>
                    {item.children.map(child => {
                      let childIsActive = false;
                      if (child.statusQuery) {
                        childIsActive = pathname === child.href.split('?')[0] && searchParams.get('status') === child.statusQuery;
                      } else {
                        // For 'Dashboard' -> 'Main Dashboard', it's active if path is '/' and no query params indicating tasks view.
                        // For 'Tasks' -> 'All Tasks', it's active if path is '/tasks' and no status query param.
                        childIsActive = pathname === child.href && 
                                        ((item.label === 'Tasks' && !searchParams.get('status')) || 
                                         (item.label === 'Dashboard' && child.href === '/'));
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
                </div>
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

