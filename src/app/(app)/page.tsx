
"use client";
import { useState, useEffect } from 'react';
import { EventTimeline } from '@/components/dashboard/event-timeline';
import { TaskPrioritization } from '@/components/dashboard/task-prioritization';
import { BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar } from 'recharts'; // Added Bar
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart'; // Added ChartTooltip
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getMockTasks, getMockEvents, subscribeToMockDataChanges } from '@/lib/mock-data'; // Import data functions
import type { Task, CalendarEvent } from '@/types';

const initialProductivityData = [
  { day: "Mon", tasksCompleted: 0, eventsScheduled: 0, focusHours: 0 },
  { day: "Tue", tasksCompleted: 0, eventsScheduled: 0, focusHours: 0 },
  { day: "Wed", tasksCompleted: 0, eventsScheduled: 0, focusHours: 0 },
  { day: "Thu", tasksCompleted: 0, eventsScheduled: 0, focusHours: 0 },
  { day: "Fri", tasksCompleted: 0, eventsScheduled: 0, focusHours: 0 },
  { day: "Sat", tasksCompleted: 0, eventsScheduled: 0, focusHours: 0 },
  { day: "Sun", tasksCompleted: 0, eventsScheduled: 0, focusHours: 0 },
];

const chartConfig = {
  tasksCompleted: {
    label: "Tasks Completed",
    color: "hsl(var(--chart-1))",
  },
  eventsScheduled: {
    label: "Events Scheduled",
    color: "hsl(var(--chart-2))",
  },
  focusHours: {
    label: "Focus Hours (Est.)", // Assuming focus hours might be estimated or manually input in a future feature
    color: "hsl(var(--chart-3))",
  }
} satisfies ChartConfig;

interface DashboardWidgetsVisibility {
  showEventTimeline: boolean;
  showTaskPrioritization: boolean;
  showProductivityInsights: boolean;
}

export default function DashboardPage() {
  const [widgetsVisibility, setWidgetsVisibility] = useState<DashboardWidgetsVisibility>({
    showEventTimeline: true,
    showTaskPrioritization: true,
    showProductivityInsights: true,
  });

  // State for tasks and events to make dashboard reactive, though TaskPrioritization and EventTimeline fetch their own
  const [, setTasks] = useState<Task[]>(getMockTasks());
  const [, setEvents] = useState<CalendarEvent[]>(getMockEvents());
  const [productivityData, setProductivityData] = useState(initialProductivityData);


  useEffect(() => {
    const unsubscribe = subscribeToMockDataChanges(() => {
      const currentTasks = getMockTasks();
      const currentEvents = getMockEvents();
      setTasks(currentTasks);
      setEvents(currentEvents);

      // Simple aggregation for productivity chart (example)
      // In a real app, this would be more sophisticated, perhaps based on event types or task properties
      const newProductivityData = [...initialProductivityData].map(dayData => ({ ...dayData })); // Deep copy
      currentTasks.forEach(task => {
        if (task.completed && task.dueDate) {
          const dayIndex = new Date(task.dueDate).getDay(); // 0 (Sun) - 6 (Sat)
          const adjustedDayIndex = (dayIndex === 0) ? 6 : dayIndex - 1; // Mon (0) - Sun (6)
          if (newProductivityData[adjustedDayIndex]) {
            newProductivityData[adjustedDayIndex].tasksCompleted += 1;
            // Example: Add 1 focus hour for each completed task (very simplistic)
            newProductivityData[adjustedDayIndex].focusHours += 1; 
          }
        }
      });
      currentEvents.forEach(event => {
        const dayIndex = new Date(event.startTime).getDay();
        const adjustedDayIndex = (dayIndex === 0) ? 6 : dayIndex - 1;
         if (newProductivityData[adjustedDayIndex]) {
            newProductivityData[adjustedDayIndex].eventsScheduled += 1;
        }
      });
      setProductivityData(newProductivityData);
    });
    // Initial data load for productivity chart
    unsubscribe(); // Call once to load initial data
    const unsubRetry = subscribeToMockDataChanges(() => { // Resubscribe
        const currentTasks = getMockTasks();
        const currentEvents = getMockEvents();
        setTasks(currentTasks);
        setEvents(currentEvents);
        const newProductivityData = [...initialProductivityData].map(dayData => ({ ...dayData, tasksCompleted: 0, eventsScheduled: 0, focusHours: 0 }));
        currentTasks.forEach(task => {
            if (task.completed && task.dueDate) {
                const dayIndex = new Date(task.dueDate).getDay();
                const adjustedDayIndex = (dayIndex === 0) ? 6 : dayIndex - 1;
                if (newProductivityData[adjustedDayIndex]) {
                    newProductivityData[adjustedDayIndex].tasksCompleted += 1;
                    newProductivityData[adjustedDayIndex].focusHours += 1;
                }
            }
        });
        currentEvents.forEach(event => {
            const dayIndex = new Date(event.startTime).getDay();
            const adjustedDayIndex = (dayIndex === 0) ? 6 : dayIndex - 1;
            if (newProductivityData[adjustedDayIndex]) {
                newProductivityData[adjustedDayIndex].eventsScheduled += 1;
            }
        });
        setProductivityData(newProductivityData);
    });


    return () => unsubRetry();
  }, []);


  const handleWidgetToggle = (widgetKey: keyof DashboardWidgetsVisibility) => {
    setWidgetsVisibility(prev => ({ ...prev, [widgetKey]: !prev[widgetKey] }));
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Customize Dashboard
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize Dashboard Widgets</DialogTitle>
              <DialogDescription>
                Choose which widgets to display on your dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
                <Label htmlFor="showEventTimeline" className="flex flex-col space-y-1">
                  <span>Event Timeline</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Shows upcoming events.
                  </span>
                </Label>
                <Switch
                  id="showEventTimeline"
                  checked={widgetsVisibility.showEventTimeline}
                  onCheckedChange={() => handleWidgetToggle('showEventTimeline')}
                  aria-label="Toggle Event Timeline visibility"
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
                <Label htmlFor="showTaskPrioritization" className="flex flex-col space-y-1">
                  <span>Priority Tasks</span>
                   <span className="font-normal leading-snug text-muted-foreground">
                    Highlights most important tasks.
                  </span>
                </Label>
                <Switch
                  id="showTaskPrioritization"
                  checked={widgetsVisibility.showTaskPrioritization}
                  onCheckedChange={() => handleWidgetToggle('showTaskPrioritization')}
                  aria-label="Toggle Priority Tasks visibility"
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-2 rounded-md border">
                <Label htmlFor="showProductivityInsights" className="flex flex-col space-y-1">
                  <span>Productivity Insights</span>
                   <span className="font-normal leading-snug text-muted-foreground">
                    Visualizes your weekly activity.
                  </span>
                </Label>
                <Switch
                  id="showProductivityInsights"
                  checked={widgetsVisibility.showProductivityInsights}
                  onCheckedChange={() => handleWidgetToggle('showProductivityInsights')}
                  aria-label="Toggle Productivity Insights visibility"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {widgetsVisibility.showEventTimeline && <EventTimeline />}
        {widgetsVisibility.showTaskPrioritization && <TaskPrioritization />}
      </div>
      
      {widgetsVisibility.showProductivityInsights && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Productivity Insights</CardTitle>
            <CardDescription>Your task, event, and estimated focus activity for the week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productivityData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8} 
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Legend content={({payload}) => {
                    if (!payload) return null;
                      return (
                        <div className="flex items-center justify-center gap-4 pt-3">
                          {payload.map((entry) => (
                            <div key={`item-${entry.value}`} className="flex items-center gap-1.5">
                              <div
                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                style={{ backgroundColor: entry.color }}
                              />
                              {chartConfig[entry.dataKey as keyof typeof chartConfig]?.label || entry.value}
                            </div>
                          ))}
                        </div>
                      )
                  }}/>
                  <Bar 
                    dataKey="tasksCompleted" 
                    fill="var(--color-tasksCompleted)" 
                    radius={[4, 4, 0, 0]}
                    // activeBar={<Rectangle fillOpacity={0.7} />} // activeBar is a recharts prop, not Shadcn
                  />
                  <Bar 
                    dataKey="eventsScheduled" 
                    fill="var(--color-eventsScheduled)" 
                    radius={[4, 4, 0, 0]} 
                    // activeBar={<Rectangle fillOpacity={0.7} />}
                  />
                   <Bar 
                    dataKey="focusHours" 
                    fill="var(--color-focusHours)" 
                    radius={[4, 4, 0, 0]} 
                    // activeBar={<Rectangle fillOpacity={0.7} />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
