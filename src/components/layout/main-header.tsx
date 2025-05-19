
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickAddDialog } from '@/components/shared/quick-add-dialog';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';

export function MainHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <SidebarTrigger className="md:hidden" /> {/* For mobile toggle & desktop collapse trigger if sidebar itself doesn't have one */}
      
      {/* Mobile-only logo and title */}
      <div className="flex items-center gap-2 md:hidden">
         <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
           <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="text-primary h-7 w-7">
            <path fill="currentColor" d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm0 72c-17.7 0-32-14.3-32-32S32.3 18 50 18s32 14.3 32 32-14.3 32-32 32z"/>
            <path fill="currentColor" d="M53 25h-6v25l21.6 12.9 3-4.9-18.6-11V25z"/>
           </svg>
           <h1 className="text-xl font-semibold">ChronoFlow</h1>
         </Link>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <QuickAddDialog>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </QuickAddDialog>
        <ThemeToggleButton />
      </div>
    </header>
  );
}
