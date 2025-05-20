
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck2, ListTodo, CalendarClockIcon, CheckCircle2, Circle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getMockTasks, getMockEvents, subscribeToMockDataChanges } from '@/lib/mock-data';
import type { Task, CalendarEvent } from '@/types';
import { format, startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AgendaCard() {
  const [allTasks, setAllTasks] = useState<Task[]>(getMockTasks());
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>(getMockEvents());

  useEffect(() => {
    const updateData = () => {
      setAllTasks(getMockTasks());
      setAllEvents(getMockEvents());
    };
    updateData(); // Initial fetch
    const unsubscribe = subscribeToMockDataChanges(updateData);
    return () => unsubscribe();
  }, []);

  const todaysItems = useMemo(() => {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const tasksForToday = allTasks
      .filter(task => {
        if (!task.dueDate) return false;
        // Ensure dueDate is treated as a Date object for comparison
        const dueDate = typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate;
        return isWithinInterval(startOfDay(dueDate), { start: todayStart, end: todayEnd });
      })
      .map(task => ({ ...task, type: 'task' as const }))
      .sort((a, b) => {
        // Sort pending tasks first, then by due date or creation date
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        const aDate = a.dueDate ? (typeof a.dueDate === 'string' ? parseISO(a.dueDate) : a.dueDate) : new Date(a.createdAt);
        const bDate = b.dueDate ? (typeof b.dueDate === 'string' ? parseISO(b.dueDate) : b.dueDate) : new Date(b.createdAt);
        return aDate.getTime() - bDate.getTime();
      });

    const eventsForToday = allEvents
      .filter(event => {
        const startTime = typeof event.startTime === 'string' ? parseISO(event.startTime) : event.startTime;
        return isWithinInterval(startTime, { start: todayStart, end: todayEnd });
      })
      .map(event => ({ ...event, type: 'event' as const }))
      .sort((a, b) => {
         const aTime = typeof a.startTime === 'string' ? parseISO(a.startTime) : a.startTime;
         const bTime = typeof b.startTime === 'string' ? parseISO(b.startTime) : b.startTime;
         return aTime.getTime() - bTime.getTime();
      });
    
    // Interleave tasks and events, then sort by time (approximating event start time for tasks)
    // This simple sort might need refinement for perfect chronological order of mixed types
    return [...tasksForToday, ...eventsForToday].sort((a,b) => {
        const aTime = a.type === 'task' ? (a.dueDate ? startOfDay(typeof a.dueDate === 'string' ? parseISO(a.dueDate) : a.dueDate) : new Date(a.createdAt)) : (typeof a.startTime === 'string' ? parseISO(a.startTime) : a.startTime);
        const bTime = b.type === 'task' ? (b.dueDate ? startOfDay(typeof b.dueDate === 'string' ? parseISO(b.dueDate) : b.dueDate) : new Date(b.createdAt)) : (typeof b.startTime === 'string' ? parseISO(b.startTime) : b.startTime);
        return aTime.getTime() - bTime.getTime();
    });

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
          <CalendarCheck2 className="mr-3 h-6 w-6 text-primary" />
          Today's Agenda - {format(new Date(), 'MMMM d, yyyy')}
        </CardTitle>
        <CardDescription>Tasks due and events scheduled for today.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {todaysItems.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground h-full flex flex-col justify-center items-center">
            <CalendarCheck2 className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="font-medium">Nothing scheduled for today yet.</p>
            <p className="text-sm">Add tasks or events, and they'll appear here if they are for today!</p>
          </div>
        ) : (
          <ScrollArea className="h-[250px] pr-3"> {/* Adjust height as needed */}
            <ul className="space-y-3">
              {todaysItems.map((item) => (
                <li key={item.id} className="p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors">
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
                          {item.dueDate && <span>Due: {format(typeof item.dueDate === 'string' ? parseISO(item.dueDate) : item.dueDate, 'p')}</span>}
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
                           <span>{format(typeof item.startTime === 'string' ? parseISO(item.startTime) : item.startTime, 'p')} - {format(typeof item.endTime === 'string' ? parseISO(item.endTime) : item.endTime, 'p')}</span>
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
