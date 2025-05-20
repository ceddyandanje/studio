
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ListTodo, CalendarClockIcon, CheckCircle2, Circle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getMockTasks, getMockEvents, subscribeToMockDataChanges } from '@/lib/mock-data';
import type { Task, CalendarEvent } from '@/types';
import { format, startOfDay, endOfDay, isWithinInterval, parseISO, addDays } from 'date-fns';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const MAX_UPCOMING_ITEMS = 5;

export function UpcomingWidgetCard() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const updateData = () => {
      setAllTasks(getMockTasks());
      setAllEvents(getMockEvents());
    };
    updateData(); // Initial fetch
    const unsubscribe = subscribeToMockDataChanges(updateData);
    return () => unsubscribe();
  }, []);

  const upcomingItems = useMemo(() => {
    const today = startOfDay(new Date());
    const nextSevenDaysEnd = endOfDay(addDays(today, 7)); // Look 7 days into the future

    const tasksUpcoming = allTasks
      .filter(task => {
        if (task.completed) return false;
        if (!task.dueDate) return false;
        const dueDate = startOfDay(typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate);
        return isWithinInterval(dueDate, { start: today, end: nextSevenDaysEnd });
      })
      .map(task => ({ ...task, type: 'task' as const, date: task.dueDate ? (typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate) : new Date(task.createdAt) }));

    const eventsUpcoming = allEvents
      .filter(event => {
        const startTime = typeof event.startTime === 'string' ? parseISO(event.startTime) : event.startTime;
        return isWithinInterval(startTime, { start: today, end: nextSevenDaysEnd }) && startTime >= today; // Ensure it's truly upcoming
      })
      .map(event => ({ ...event, type: 'event' as const, date: typeof event.startTime === 'string' ? parseISO(event.startTime) : event.startTime }));

    return [...tasksUpcoming, ...eventsUpcoming]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, MAX_UPCOMING_ITEMS);

  }, [allTasks, allEvents]);
  
  const priorityStyles = {
    low: 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400',
    medium: 'border-yellow-500 dark:border-yellow-400 text-yellow-600 dark:text-yellow-400',
    high: 'border-red-500 dark:border-red-400 text-red-600 dark:text-red-400',
  };


  return (
    <Card className="shadow-md h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <TrendingUp className="mr-3 h-6 w-6 text-primary" />
          Upcoming (Next 7 Days)
        </CardTitle>
        <CardDescription>A glimpse of what's next on your schedule.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {upcomingItems.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground h-full flex flex-col justify-center items-center">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="font-medium">Nothing upcoming in the next 7 days.</p>
            <p className="text-sm">Add tasks with due dates or schedule events, and they'll appear here.</p>
          </div>
        ) : (
          <ScrollArea className="h-[250px] pr-3">
            <ul className="space-y-3">
              {upcomingItems.map((item) => (
                <li key={`${item.type}-${item.id}`} className="p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors">
                  {item.type === 'task' ? (
                    <Link href="/tasks" className="flex items-start space-x-3 group">
                       {item.completed ? <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> : <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary mt-0.5 shrink-0" />}
                      <div className="flex-grow">
                        <p className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {item.title}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground space-x-2">
                          <ListTodo className="h-3 w-3" /> 
                          <span>Task</span>
                           <Badge variant="outline" className={`capitalize text-xs px-1.5 py-0.5 ${priorityStyles[item.priority]}`}>
                            {item.priority}
                          </Badge>
                          {item.dueDate && <span>Due: {format(item.date, 'PP')}</span>}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link href="/calendar" className="flex items-start space-x-3 group">
                      <CalendarClockIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div className="flex-grow">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground space-x-2">
                          <CalendarClockIcon className="h-3 w-3" />
                           <span>Event</span>
                           <span>{format(item.date, 'PPp')}</span>
                        </div>
                      </div>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
