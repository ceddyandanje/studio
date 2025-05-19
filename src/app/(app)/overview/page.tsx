
"use client";

import { useState, useEffect } from 'react';
import type { Task } from '@/types';
import { mockTasks } from '@/lib/mock-data';
import { TaskCard } from '@/components/tasks/task-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ListChecks } from 'lucide-react';
import { format, addDays, isWithinInterval, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function OverviewPage() {
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const today = startOfDay(new Date());
    const nextSevenDaysEnd = addDays(today, 7);

    const filteredTasks = mockTasks.filter(task => {
      if (task.completed) return false;
      if (!task.dueDate) return false; // Only include tasks with due dates
      const dueDate = startOfDay(new Date(task.dueDate));
      return isWithinInterval(dueDate, { start: today, end: nextSevenDaysEnd });
    }).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
    
    setUpcomingTasks(filteredTasks);
  }, []);

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    setUpcomingTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed } : task
      ).filter(task => !task.completed) // Remove from overview if completed
    );
     mockTasks.forEach(mockTask => { // Update the source mock data as well
      if (mockTask.id === taskId) {
        mockTask.completed = completed;
      }
    });
    toast({
      title: `Task ${completed ? 'completed' : 'marked pending'}`,
      description: upcomingTasks.find(t => t.id === taskId)?.title,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setUpcomingTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    mockTasks.splice(mockTasks.findIndex(t => t.id === taskId), 1); // Update source
    toast({
      title: "Task Deleted",
      description: `Task "${upcomingTasks.find(t => t.id === taskId)?.title}" has been removed.`,
      variant: "destructive"
    });
  };


  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <Activity className="mr-3 h-8 w-8 text-primary" />
          Upcoming Tasks Overview
        </h2>
      </div>
      <p className="text-muted-foreground">
        A glimpse of your tasks due in the next 7 days. Stay organized and on top of your schedule!
      </p>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Tasks for {format(new Date(), 'MMMM d')} - {format(addDays(new Date(), 6), 'MMMM d, yyyy')}</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-10">
              <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg text-muted-foreground">
                No tasks due in the next 7 days.
              </p>
              <p className="text-sm text-muted-foreground">Enjoy the peace or plan ahead!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {upcomingTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
