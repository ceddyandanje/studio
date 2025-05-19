
"use client";

import * as React from 'react'; // Added React import
import { useState, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Priority } from '@/types';
import { addMockTask, addMockEvent } from '@/lib/mock-data'; // Import new functions
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  type: z.enum(['event', 'task']),
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  description: z.string().optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.date().optional(),
}).refine(data => {
  if (data.type === 'event' && (!data.startTime || !data.endTime)) {
    return false;
  }
  return true;
}, {
  message: "Start and end time are required for events",
  path: ["startTime"], 
}).refine(data => {
  if (data.type === 'event' && data.startTime && data.endTime && data.endTime < data.startTime) {
    return false;
  }
  return true;
}, {
  message: "End time cannot be before start time",
  path: ["endTime"],
});

type QuickAddFormValues = z.infer<typeof formSchema>;

interface QuickAddDialogProps {
  children: ReactNode;
  defaultType?: 'task' | 'event';
}

export function QuickAddDialog({ children, defaultType = 'task' }: QuickAddDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuickAddFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: defaultType,
      title: '',
      description: '',
      priority: 'medium',
    },
  });

  // Reset form when dialog opens or type changes
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        type: defaultType,
        title: '',
        description: '',
        priority: 'medium',
        startTime: undefined,
        endTime: undefined,
        dueDate: undefined,
      });
    }
  }, [isOpen, defaultType, form]);


  const itemType = form.watch('type');

  function onSubmit(values: QuickAddFormValues) {
    if (values.type === 'task') {
      addMockTask({
        title: values.title,
        description: values.description,
        priority: values.priority as Priority, // Zod enum ensures this is valid
        dueDate: values.dueDate,
      });
      toast({
        title: 'Task Added!',
        description: `"${values.title}" has been added to your tasks.`,
      });
    } else if (values.type === 'event') {
      // startTime and endTime are guaranteed by refine
      addMockEvent({
        title: values.title,
        description: values.description,
        startTime: values.startTime!,
        endTime: values.endTime!,
      });
      toast({
        title: 'Event Added!',
        description: `"${values.title}" has been added to your calendar.`,
      });
    }
    setIsOpen(false);
    form.reset(); 
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Quick Add</DialogTitle>
          <DialogDescription>
            Quickly add a new task or calendar event.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.reset({ // Reset other fields when type changes
                          ...form.getValues(),
                           type: value as 'task' | 'event',
                           title: form.getValues('title'), // keep title
                           description: form.getValues('description'), // keep description
                           priority: 'medium',
                           startTime: undefined,
                           endTime: undefined,
                           dueDate: undefined,
                        });
                      }}
                      value={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="task" />
                        </FormControl>
                        <FormLabel className="font-normal">Task</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="event" />
                        </FormControl>
                        <FormLabel className="font-normal">Event</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Weekly Sync or Finalize Report" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add more details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {itemType === 'event' && (
              <>
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Time</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP HH:mm")
                              ) : (
                                <span>Pick a date and time</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                          <div className="p-2 border-t">
                            <Input 
                              type="time" 
                              defaultValue={field.value ? format(field.value, "HH:mm") : ""} 
                              onChange={(e) => {
                                const newDate = field.value ? new Date(field.value) : new Date();
                                const [hours, minutes] = e.target.value.split(':');
                                newDate.setHours(parseInt(hours), parseInt(minutes));
                                field.onChange(newDate);
                              }} 
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Time</FormLabel>
                       <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP HH:mm")
                              ) : (
                                <span>Pick a date and time</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                           <div className="p-2 border-t">
                            <Input 
                              type="time" 
                              defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                              onChange={(e) => {
                                const newDate = field.value ? new Date(field.value) : new Date();
                                const [hours, minutes] = e.target.value.split(':');
                                newDate.setHours(parseInt(hours), parseInt(minutes));
                                field.onChange(newDate);
                              }}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {itemType === 'task' && (
              <>
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue="medium">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} 
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
