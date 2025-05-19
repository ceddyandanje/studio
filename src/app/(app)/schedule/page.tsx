import { AISchedulerForm } from '@/components/schedule/ai-scheduler-form';
import { Sparkles } from 'lucide-react';

export default function AISchedulerPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <Sparkles className="mr-3 h-8 w-8 text-primary" />
          AI-Powered Scheduling
        </h2>
      </div>
      <p className="text-muted-foreground">
        Let ChronoFlow's AI analyze your calendar and productivity patterns to suggest the best times for your new tasks.
        Fill in the details below to get started.
      </p>
      <AISchedulerForm />
    </div>
  );
}
