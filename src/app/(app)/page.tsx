"use client";
import { EventTimeline } from '@/components/dashboard/event-timeline';
import { TaskPrioritization } from '@/components/dashboard/task-prioritization';
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'; // ChartTooltip, ChartLegend can also be used from here if needed

const productivityData = [
  { day: "Mon", tasksCompleted: 4, eventsScheduled: 2 },
  { day: "Tue", tasksCompleted: 3, eventsScheduled: 3 },
  { day: "Wed", tasksCompleted: 5, eventsScheduled: 1 },
  { day: "Thu", tasksCompleted: 4, eventsScheduled: 4 },
  { day: "Fri", tasksCompleted: 6, eventsScheduled: 2 },
  { day: "Sat", tasksCompleted: 2, eventsScheduled: 5 },
  { day: "Sun", tasksCompleted: 1, eventsScheduled: 1 },
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
} satisfies ChartConfig;


export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <EventTimeline />
        <TaskPrioritization />
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Productivity Insights</CardTitle>
          <CardDescription>Your task and event activity for the week.</CardDescription>
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
                  activeBar={<Rectangle fillOpacity={0.7} />}
                />
                <Bar 
                  dataKey="eventsScheduled" 
                  fill="var(--color-eventsScheduled)" 
                  radius={[4, 4, 0, 0]} 
                  activeBar={<Rectangle fillOpacity={0.7} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
