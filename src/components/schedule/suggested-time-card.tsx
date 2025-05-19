"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface SuggestedTimeCardProps {
  time: string; // ISO 8601 string
  taskName: string;
}

export function SuggestedTimeCard({ time, taskName }: SuggestedTimeCardProps) {
  const { toast } = useToast();
  const date = new Date(time);

  const handleAddToCalendar = () => {
    // In a real app, this would interact with a calendar API or state
    console.log(`Add ${taskName} at ${time} to calendar`);
    toast({
      title: "Added to Calendar (Simulated)",
      description: `${taskName} scheduled for ${format(date, 'PPp')}.`,
    });
  };

  return (
    <Card className="bg-background shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold">{format(date, 'EEEE, MMMM d')}</CardTitle>
        <CardDescription className="text-2xl font-bold text-primary">{format(date, 'p')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-3">Suggested for: <span className="font-medium text-foreground">{taskName}</span></p>
        <Button onClick={handleAddToCalendar} className="w-full">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add to Calendar
        </Button>
      </CardContent>
    </Card>
  );
}
