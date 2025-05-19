"use client";

import { mockTasks } from '@/lib/mock-data';
import type { Task } from '@/types';
import { TaskCard } from '@/components/tasks/task-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks, AlertTriangle } from 'lucide-react';

const priorityOrder = { high: 1, medium: 2, low: 3 };

export function TaskPrioritization() {
  // In a real app, fetch tasks
  const activeTasks = mockTasks.filter(task => !task.completed);
  
  const sortedTasks = [...activeTasks]
    .sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1; // Tasks with due dates first
      if (b.dueDate) return 1;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // Fallback to creation date
    })
    .slice(0, 5); // Show a limited number on dashboard

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <ListChecks className="mr-2 h-6 w-6 text-primary" />
          Priority Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTasks.length === 0 ? (
          <p className="text-muted-foreground">No pending tasks. Great job!</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {sortedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
