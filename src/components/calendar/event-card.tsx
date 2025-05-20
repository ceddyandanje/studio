
"use client";

import type { CalendarEvent } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CalendarClock, Edit3, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: CalendarEvent;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const [reminderSet, setReminderSet] = useState(false); // Mock state for reminder

  const handleToggleReminder = () => {
    setReminderSet(!reminderSet);
    // In a real app, this would update backend and schedule/cancel notification
  };

  const eventColorStyle = event.color ? { borderLeftColor: event.color, borderLeftWidth: '4px' } : {};

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300" style={eventColorStyle}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
          <Badge variant={new Date(event.startTime) < new Date() ? "outline" : "default"} className={cn(new Date(event.startTime) < new Date() ? "bg-muted text-muted-foreground" : "bg-blue-100 text-blue-700")}>
            {new Date(event.startTime) < new Date() ? 'Past' : 'Upcoming'}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarClock className="mr-2 h-4 w-4" />
          <span>{format(new Date(event.startTime), 'PPp')} - {format(new Date(event.endTime), 'p')}</span>
        </div>
      </CardHeader>
      {event.description && (
        <CardContent className="py-2">
          <p className="text-sm text-muted-foreground">{event.description}</p>
        </CardContent>
      )}
      <CardFooter className="flex justify-between items-center pt-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleReminder}
          aria-label={reminderSet ? "Unset reminder" : "Set reminder"}
          className={cn(reminderSet ? "text-primary" : "text-muted-foreground", "hover:text-primary")}
        >
          <Bell className={cn("h-5 w-5", reminderSet && "fill-primary")} />
        </Button>
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
              <Edit3 className="mr-1 h-4 w-4" /> Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={() => onDelete(event.id)}>
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
