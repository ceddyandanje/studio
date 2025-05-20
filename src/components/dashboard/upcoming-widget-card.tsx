
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export function UpcomingWidgetCard() {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <TrendingUp className="mr-3 h-6 w-6 text-primary" />
          Upcoming
        </CardTitle>
        <CardDescription>A glimpse of what's next.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6 text-muted-foreground">
          <p>No upcoming items to display.</p>
          <p className="text-sm">Key upcoming tasks and events will show here.</p>
        </div>
        {/* Placeholder for upcoming items */}
      </CardContent>
    </Card>
  );
}
