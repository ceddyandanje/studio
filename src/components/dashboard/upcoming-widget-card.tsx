
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
          <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="font-medium">No upcoming items to display.</p>
          <p className="text-sm">Key upcoming tasks and important events will be highlighted here to keep you prepared.</p>
        </div>
        {/* Placeholder for upcoming items */}
      </CardContent>
    </Card>
  );
}
