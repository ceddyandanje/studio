
"use client";

import { useState, useEffect, useMemo } from 'react';
import { getMockEvents, subscribeToMockDataChanges } from '@/lib/mock-data';
import type { CalendarEvent } from '@/types';
import { EventCard } from '@/components/calendar/event-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarClock, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export function EventTimeline() {
  const [events, setEvents] = useState<CalendarEvent[]>(getMockEvents());

  useEffect(() => {
    const unsubscribe = subscribeToMockDataChanges(() => {
      setEvents(getMockEvents());
    });
    return () => unsubscribe();
  }, []);
  
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return [...events]
      .filter(event => new Date(event.startTime) >= now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5);
  }, [events]);


  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <CalendarClock className="mr-2 h-6 w-6 text-primary" />
          Upcoming Events
        </CardTitle>
        <CardDescription>Your next few scheduled events.</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <Info className="mx-auto h-10 w-10 text-primary" />
            <h3 className="text-lg font-semibold">Calendar is Empty!</h3>
            <p className="text-sm text-muted-foreground">
              No events scheduled yet. Keep your day organized by adding events.
            </p>
             <p className="text-sm text-muted-foreground">
              Add events via the "Quick Add" button in the header or on the <Link href="/calendar" className="text-primary underline hover:text-primary/80">Calendar page</Link>.
            </p>
            <Button asChild variant="secondary" size="sm" className="mt-2">
                <Link href="/calendar">Go to Calendar Page</Link>
            </Button>
          </div>
        ) : upcomingEvents.length === 0 ? (
           <p className="text-muted-foreground text-center py-4">No upcoming events. Check past events on the <Link href="/calendar" className="text-primary underline hover:text-primary/80">Calendar page</Link>.</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                 // Note: EventCard itself handles delete by calling mock-data functions
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
