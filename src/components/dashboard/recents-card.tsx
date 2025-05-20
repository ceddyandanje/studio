
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock4 } from 'lucide-react';

export function RecentsCard() {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Clock4 className="mr-3 h-6 w-6 text-primary" />
          Recents
        </CardTitle>
        <CardDescription>Your recently viewed or interacted items.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6 text-muted-foreground">
          <Clock4 className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="font-medium">No recent activity yet.</p>
          <p className="text-sm">Your recent interactions with tasks, events, or documents will appear here for quick access.</p>
        </div>
      </CardContent>
    </Card>
  );
}
