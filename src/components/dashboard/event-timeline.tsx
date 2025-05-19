"use client";

import { mockEvents } from '@/lib/mock-data';
import type { CalendarEvent } from '@/types';
import { EventCard } from '@/components/calendar/event-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarClock } from 'lucide-react';

export function EventTimeline() {
  // In a real app, fetch events and sort them
  const sortedEvents = [...mockEvents]
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5); // Show a limited number on dashboard

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <CalendarClock className="mr-2 h-6 w-6 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEvents.length === 0 ? (
          <p className="text-muted-foreground">No upcoming events.</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {sortedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
