"use client";

import { useState, useEffect } from 'react';
import type { CalendarEvent } from '@/types';
import { mockEvents } from '@/lib/mock-data';
import { EventCard } from '@/components/calendar/event-card';
import { Button } from '@/components/ui/button';
import { CalendarDays, PlusCircle } from 'lucide-react';
import { QuickAddDialog } from '@/components/shared/quick-add-dialog';
import { Calendar } from '@/components/ui/calendar'; // ShadCN Calendar for date picking/display
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching events
    setEvents(mockEvents);
  }, []);

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    toast({
      title: "Event Deleted",
      description: `Event "${events.find(e => e.id === eventId)?.title}" has been removed.`,
      variant: "destructive"
    });
  };
  
  const eventsForSelectedDate = events
    .filter(event => 
      selectedDate && 
      format(new Date(event.startTime), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    )
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <CalendarDays className="mr-3 h-8 w-8 text-primary" />
          My Calendar
        </h2>
        <QuickAddDialog>
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Event
          </Button>
        </QuickAddDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
          <CardContent className="p-2 sm:p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              // Modifiers can be used to highlight days with events
              modifiers={{ events: events.map(e => new Date(e.startTime)) }}
              modifiersClassNames={{ events: 'bg-primary/20 rounded-full' }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>
              Events for {selectedDate ? format(selectedDate, 'PPP') : 'selected date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsForSelectedDate.length === 0 ? (
              <div className="text-center py-10">
                <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg text-muted-foreground">
                  No events scheduled for this day.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {eventsForSelectedDate.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={handleDeleteEvent}
                    // onEdit could open a dialog
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
