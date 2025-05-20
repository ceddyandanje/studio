
"use client";
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Search, SlidersHorizontal, X, LayoutDashboard, LayoutGrid } from 'lucide-react';
import { RecentsCard } from '@/components/dashboard/recents-card';
import { AgendaCard } from '@/components/dashboard/agenda-card';
import { MyWorkCard } from '@/components/dashboard/my-work-card';
import { UpcomingWidgetCard } from '@/components/dashboard/upcoming-widget-card';
import { cn } from '@/lib/utils';
import type { Task, CalendarEvent } from '@/types';
import { getMockTasks, getMockEvents, subscribeToMockDataChanges } from '@/lib/mock-data';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays, startOfDay } from 'date-fns';
import _ from 'lodash';


interface DashboardCardsVisibility {
  showRecents: boolean;
  showAgenda: boolean;
  showMyWork: boolean;
  showUpcomingWidget: boolean;
  showProductivityInsights: boolean;
}

export default function DashboardPage() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);

  const [cardsVisibility, setCardsVisibility] = useState<DashboardCardsVisibility>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboardCardsVisibility');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      showRecents: true,
      showAgenda: true,
      showMyWork: true,
      showUpcomingWidget: true,
      showProductivityInsights: true,
    };
  });

  useEffect(() => {
    const handleDataChange = () => {
      setAllTasks(getMockTasks());
      setAllEvents(getMockEvents());
    };
    handleDataChange(); // Initial data load
    const unsubscribe = subscribeToMockDataChanges(handleDataChange);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboardCardsVisibility', JSON.stringify(cardsVisibility));
  }, [cardsVisibility]);

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

  const productivityData = useMemo(() => {
    const taskCounts = _.countBy(allTasks, task => format(startOfDay(new Date(task.createdAt)), 'yyyy-MM-dd'));
    const eventCounts = _.countBy(allEvents, event => format(startOfDay(new Date(event.startTime)), 'yyyy-MM-dd'));
    
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = startOfDay(subDays(new Date(), i));
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    return last7Days.map(day => ({
      date: format(new Date(day), 'MMM d'),
      tasks: taskCounts[day] || 0,
      events: eventCounts[day] || 0,
      focusHours: (taskCounts[day] || 0) * 0.5 + (eventCounts[day] || 0) * 1, // Example calculation
    }));
  }, [allTasks, allEvents]);
  
  const chartConfig = {
    tasks: { label: "Tasks Added", color: "hsl(var(--chart-1))" },
    events: { label: "Events Scheduled", color: "hsl(var(--chart-2))" },
    focusHours: { label: "Focus Hours", color: "hsl(var(--chart-3))" },
  } as const;


  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
          <LayoutDashboard className="mr-3 h-8 w-8 text-primary" />
          Dashboard
        </h2>
        <div className="flex items-center gap-2" id="dashboard-search-container">
          <div className={cn("flex items-center transition-all duration-300 ease-in-out", searchVisible ? "w-full max-w-xs sm:w-64" : "w-0")}>
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
                  { key: 'showProductivityInsights', label: 'Productivity Insights', description: 'Visualizes your activity.' },
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

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {cardsVisibility.showRecents && <RecentsCard />}
        {cardsVisibility.showAgenda && <AgendaCard />}
        {cardsVisibility.showMyWork && <MyWorkCard />}
        {cardsVisibility.showUpcomingWidget && <UpcomingWidgetCard />}
         {cardsVisibility.showProductivityInsights && (
          <Card className="shadow-md lg:col-span-2">
            <CardHeader>
              <CardTitle>Productivity Insights (Last 7 Days)</CardTitle>
              <CardDescription>Tasks added, events scheduled, and estimated focus hours.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pr-6 pb-6">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={productivityData} accessibilityLayer>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="tasks" fill="var(--color-tasks)" radius={4} />
                  <Bar dataKey="events" fill="var(--color-events)" radius={4} />
                  <Bar dataKey="focusHours" fill="var(--color-focusHours)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {(Object.values(cardsVisibility).every(v => !v)) && (
        <div className="text-center py-10 text-muted-foreground">
            <LayoutGrid className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">Your Dashboard is Customizable!</p>
            <p>Use the "Manage Cards" button above to select and display widgets that suit your workflow.</p>
        </div>
      )}
    </div>
  );
}
