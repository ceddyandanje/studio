
"use client";

import { useState, useEffect, useMemo } from 'react';
import { getMockTasks, subscribeToMockDataChanges } from '@/lib/mock-data';
import type { Task } from '@/types';
import { TaskCard } from '@/components/tasks/task-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks, AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

const priorityOrder = { high: 1, medium: 2, low: 3 };

export function TaskPrioritization() {
  const [tasks, setTasks] = useState<Task[]>(getMockTasks());

  useEffect(() => {
    const unsubscribe = subscribeToMockDataChanges(() => {
      setTasks(getMockTasks());
    });
    return () => unsubscribe();
  }, []);

  const sortedTasks = useMemo(() => {
    const activeTasks = tasks.filter(task => !task.completed);
    return [...activeTasks]
      .sort((a, b) => {
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate) return -1; 
        if (b.dueDate) return 1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); 
      })
      .slice(0, 5);
  }, [tasks]);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <ListChecks className="mr-2 h-6 w-6 text-primary" />
          Priority Tasks
        </CardTitle>
         <CardDescription>Your most important active tasks.</CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.filter(task => !task.completed).length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <Info className="mx-auto h-10 w-10 text-primary" />
            <h3 className="text-lg font-semibold">No Active Tasks!</h3>
            <p className="text-sm text-muted-foreground">
              Looks like you're all caught up or new to Antikythera Scheduler.
            </p>
            <p className="text-sm text-muted-foreground">
              Add tasks via the "Quick Add" button in the header or on the <Link href="/tasks" className="text-primary underline hover:text-primary/80">Tasks page</Link>.
            </p>
            <Button asChild variant="secondary" size="sm" className="mt-2">
                <Link href="/tasks">Go to Tasks Page</Link>
            </Button>
          </div>
        ) : sortedTasks.length === 0 ? (
           <p className="text-muted-foreground text-center py-4">No tasks fit the priority criteria for display here, but you have active tasks.</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {sortedTasks.map((task) => (
                // Note: TaskCard itself handles delete/complete by calling mock-data functions
                // So no direct handlers needed here if TaskCard is self-contained for mutations
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

