
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Task } from '@/types';
import { getMockTasks, deleteMockTask, toggleMockTaskComplete, subscribeToMockDataChanges } from '@/lib/mock-data';
import { TaskCard } from '@/components/tasks/task-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListChecks, PlusCircle, Search } from 'lucide-react';
import { QuickAddDialog } from '@/components/shared/quick-add-dialog';
import { useToast } from '@/hooks/use-toast';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(getMockTasks());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all'); // 'all', 'pending', 'completed'

  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToMockDataChanges(() => {
      setTasks(getMockTasks());
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    toggleMockTaskComplete(taskId, completed);
    toast({
      title: `Task ${completed ? 'completed' : 'marked pending'}`,
      description: tasks.find(t => t.id === taskId)?.title,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    deleteMockTask(taskId);
    toast({
      title: "Task Deleted",
      description: `Task "${taskToDelete?.title}" has been removed.`,
      variant: "destructive"
    });
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(task => filterPriority === 'all' || task.priority === filterPriority)
      .filter(task => 
        filterStatus === 'all' || 
        (filterStatus === 'pending' && !task.completed) ||
        (filterStatus === 'completed' && task.completed)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tasks, searchTerm, filterPriority, filterStatus]);

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <ListChecks className="mr-3 h-8 w-8 text-primary" />
          My Tasks
        </h2>
        <QuickAddDialog defaultType="task">
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Task
          </Button>
        </QuickAddDialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-10">
          <ListChecks className="mx-auto h-16 w-16 text-muted-foreground" /> {/* Increased icon size */}
          <p className="mt-4 text-lg text-muted-foreground">
            {tasks.length === 0 ? "Your task list is wonderfully empty!" : "No tasks match your current filters."}
          </p>
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground">Ready to get started? Add a new task using the button above!</p>
          )}
          {tasks.length > 0 && (searchTerm !== '' || filterPriority !== 'all' || filterStatus !== 'all') && (
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria to find what you're looking for.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
