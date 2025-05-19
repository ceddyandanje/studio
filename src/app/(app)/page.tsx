import { EventTimeline } from '@/components/dashboard/event-timeline';
import { TaskPrioritization } from '@/components/dashboard/task-prioritization';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        {/* Placeholder for potential actions like date range picker */}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <EventTimeline />
        <TaskPrioritization />
      </div>
      
      <div className="mt-8 p-6 bg-card rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Productivity Insights</h3>
        <div className="aspect-[16/9] relative">
          <Image 
            src="https://placehold.co/600x338.png" 
            alt="Productivity Chart Placeholder" 
            layout="fill"
            objectFit="cover"
            className="rounded-md"
            data-ai-hint="productivity chart"
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Visualize your task completion and event schedule trends. (Placeholder for chart)
        </p>
      </div>
    </div>
  );
}
