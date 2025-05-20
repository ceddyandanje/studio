
"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { RecentsCard } from '@/components/dashboard/recents-card';
import { AgendaCard } from '@/components/dashboard/agenda-card';
import { MyWorkCard } from '@/components/dashboard/my-work-card';
import { UpcomingWidgetCard } from '@/components/dashboard/upcoming-widget-card';
import { cn } from '@/lib/utils';

interface DashboardCardsVisibility {
  showRecents: boolean;
  showAgenda: boolean;
  showMyWork: boolean;
  showUpcomingWidget: boolean;
}

export default function DashboardPage() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cardsVisibility, setCardsVisibility] = useState<DashboardCardsVisibility>({
    showRecents: true,
    showAgenda: true,
    showMyWork: true,
    showUpcomingWidget: true,
  });

  const handleCardToggle = (cardKey: keyof DashboardCardsVisibility) => {
    setCardsVisibility(prev => ({ ...prev, [cardKey]: !prev[cardKey] }));
  };

  // Effect to hide search bar if clicked outside - basic implementation
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const searchContainer = document.getElementById('dashboard-search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        // setSearchVisible(false); // This can be too aggressive, consider explicit close
      }
    }
    if (searchVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchVisible]);


  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <div className="flex items-center gap-2" id="dashboard-search-container">
          <div className={cn("flex items-center transition-all duration-300 ease-in-out", searchVisible ? "w-64" : "w-0")}>
            {searchVisible && (
              <Input
                type="search"
                placeholder="Search dashboard..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSearchVisible(!searchVisible)} aria-label={searchVisible ? "Close search" : "Open search"}>
            {searchVisible ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Manage Cards
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Dashboard Cards</DialogTitle>
                <DialogDescription>
                  Choose which cards to display on your dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-3">
                {[
                  { key: 'showRecents', label: 'Recents Card', description: 'Shows recent activity.' },
                  { key: 'showAgenda', label: 'Agenda Card', description: 'Displays today\'s agenda.' },
                  { key: 'showMyWork', label: 'My Work Card', description: 'Highlights your tasks.' },
                  { key: 'showUpcomingWidget', label: 'Upcoming Widget', description: 'Quick look at what\'s next.' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between space-x-2 p-2 rounded-md border">
                    <Label htmlFor={item.key} className="flex flex-col space-y-1 cursor-pointer">
                      <span>{item.label}</span>
                      <span className="font-normal leading-snug text-muted-foreground">
                        {item.description}
                      </span>
                    </Label>
                    <Switch
                      id={item.key}
                      checked={cardsVisibility[item.key as keyof DashboardCardsVisibility]}
                      onCheckedChange={() => handleCardToggle(item.key as keyof DashboardCardsVisibility)}
                      aria-label={`Toggle ${item.label} visibility`}
                    />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {cardsVisibility.showRecents && <RecentsCard />}
        {cardsVisibility.showAgenda && <AgendaCard />}
        {cardsVisibility.showMyWork && <MyWorkCard />}
        {cardsVisibility.showUpcomingWidget && <UpcomingWidgetCard />}
      </div>
       {(Object.values(cardsVisibility).every(v => !v)) && (
        <div className="text-center py-10 text-muted-foreground">
            <p className="text-lg">Your dashboard is empty!</p>
            <p>Use the "Manage Cards" button to add some widgets.</p>
        </div>
      )}
    </div>
  );
}
