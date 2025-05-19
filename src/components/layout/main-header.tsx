import { Menu, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickAddDialog } from '@/components/shared/quick-add-dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarNav } from './sidebar-nav'; // Assuming SidebarNav will be created for mobile sheet

export function MainHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SidebarNav isMobile={true} />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
         <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path fill="currentColor" d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm0 72c-17.7 0-32-14.3-32-32S32.3 18 50 18s32 14.3 32 32-14.3 32-32 32z"/>
          <path fill="currentColor" d="M53 25h-6v25l21.6 12.9 3-4.9-18.6-11V25z"/>
        </svg>
        <h1 className="text-xl font-semibold text-primary">ChronoFlow</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <QuickAddDialog>
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" />
            Quick Add
          </Button>
        </QuickAddDialog>
      </div>
    </header>
  );
}
