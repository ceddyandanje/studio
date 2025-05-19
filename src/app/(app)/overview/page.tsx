
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Task } from '@/types';
import { getMockTasks, deleteMockTask, toggleMockTaskComplete, subscribeToMockDataChanges } from '@/lib/mock-data';
import { TaskCard } from '@/components/tasks/task-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ListChecks } from 'lucide-react';
import { format, addDays, isWithinInterval, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { QuickAddDialog } from '@/components/shared/quick-add-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function OverviewPage() {
  const [allTasks, setAllTasks] = useState<Task[]>(getMockTasks());
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToMockDataChanges(() => {
      setAllTasks(getMockTasks());
    });
    return () => unsubscribe();
  }, []);

  const upcomingTasks = useMemo(() => {
    const today = startOfDay(new Date());
    const nextSevenDaysEnd = addDays(today, 7);

    return allTasks.filter(task => {
      if (task.completed) return false;
      if (!task.dueDate) return false; 
      const dueDate = startOfDay(new Date(task.dueDate));
      return isWithinInterval(dueDate, { start: today, end: nextSevenDaysEnd });
    }).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  }, [allTasks]);
  

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    toggleMockTaskComplete(taskId, completed);
    toast({
      title: `Task ${completed ? 'completed' : 'marked pending'}`,
      description: allTasks.find(t => t.id === taskId)?.title,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = allTasks.find(t => t.id === taskId);
    deleteMockTask(taskId);
    toast({
      title: "Task Deleted",
      description: `Task "${taskToDelete?.title}" has been removed.`,
      variant: "destructive"
    });
  };


  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <Activity className="mr-3 h-8 w-8 text-primary" />
          Upcoming Tasks Overview
        </h2>
         <QuickAddDialog defaultType="task">
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </QuickAddDialog>
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
              <p className="text-sm text-muted-foreground">
                {allTasks.filter(t => !t.completed).length === 0 
                  ? "Your task list is empty. Add some tasks to get started!" 
                  : "Enjoy the peace or plan ahead!"}
              </p>
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
