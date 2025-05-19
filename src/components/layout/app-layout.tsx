
import { MainHeader } from '@/components/layout/main-header';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';


export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" className="bg-sidebar text-sidebar-foreground">
        <SidebarRail />
        <SidebarHeader className="p-2">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary px-2 py-3.5">
            <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path fill="currentColor" d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm0 72c-17.7 0-32-14.3-32-32S32.3 18 50 18s32 14.3 32 32-14.3 32-32 32z"/>
              <path fill="currentColor" d="M53 25h-6v25l21.6 12.9 3-4.9-18.6-11V25z"/>
            </svg>
            <span className="group-data-[collapsible=icon]:hidden text-lg">ChronoFlow</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2">
           <Link href="/settings" className="w-full">
             <Button variant="ghost" className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-0">
                <Settings className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
             </Button>
            </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <MainHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:gap-6 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
