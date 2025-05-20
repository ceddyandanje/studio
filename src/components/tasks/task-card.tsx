
"use client";

import type { Task } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, CalendarDays, CheckCircle2, Circle, Edit3, AlertTriangle, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const priorityStyles = {
  low: 'border-blue-500 dark:border-blue-400',
  medium: 'border-yellow-500 dark:border-yellow-400',
  high: 'border-red-500 dark:border-red-400',
};

const priorityTextStyles = {
  low: 'text-blue-600 dark:text-blue-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  high: 'text-red-600 dark:text-red-400',
};

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const [reminderSet, setReminderSet] = useState(false); // Mock state for reminder

  const handleToggleReminder = () => {
    setReminderSet(!reminderSet);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <Card className={cn(
      "overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300",
      task.completed ? "bg-muted/50 opacity-70" : "bg-card",
      `border-l-4 ${priorityStyles[task.priority]}`
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className={cn("text-lg font-semibold", task.completed && "line-through")}>
            {task.title}
          </CardTitle>
          <div className="flex items-center gap-2">
             {isOverdue && <AlertTriangle className="h-5 w-5 text-destructive" />}
            <Badge variant={task.completed ? "secondary" : "outline"} className={cn(priorityTextStyles[task.priority], 'capitalize')}>
              {task.priority}
            </Badge>
          </div>
        </div>
        {task.dueDate && (
          <div className={cn("flex items-center text-sm", isOverdue ? "text-destructive" : "text-muted-foreground")}>
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Due: {format(new Date(task.dueDate), 'PP')}</span>
            {isOverdue && <span className="ml-2 font-semibold">(Overdue)</span>}
          </div>
        )}
        {!task.dueDate && (
           <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>No due date</span>
          </div>
        )}
      </CardHeader>
      {task.description && (
        <CardContent className="py-2">
          <p className={cn("text-sm text-muted-foreground", task.completed && "line-through")}>{task.description}</p>
        </CardContent>
      )}
      <CardFooter className="flex justify-between items-center pt-3">
        <div className="flex items-center gap-2">
          {onToggleComplete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleComplete(task.id, !task.completed)}
              className="pl-0 hover:bg-transparent"
            >
              {task.completed ? <CheckCircle2 className="h-6 w-6 text-accent" /> : <Circle className="h-6 w-6 text-muted-foreground hover:text-primary" />}
              <span className="ml-2 sr-only">{task.completed ? "Mark as incomplete" : "Mark as complete"}</span>
            </Button>
          )}
           <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleReminder}
            aria-label={reminderSet ? "Unset reminder" : "Set reminder"}
            className={cn(reminderSet ? "text-primary" : "text-muted-foreground", "hover:text-primary")}
          >
            <Bell className={cn("h-5 w-5", reminderSet && "fill-primary")} />
          </Button>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
              <Edit3 className="mr-1 h-4 w-4" /> Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={() => onDelete(task.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </CardFooter>
      <div className="px-6 pb-3 text-xs text-muted-foreground">
          Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
      </div>
    </Card>
  );
}
