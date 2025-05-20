
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserSquare2 } from 'lucide-react';

export function MyWorkCard() {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <UserSquare2 className="mr-3 h-6 w-6 text-primary" />
          My Work
        </CardTitle>
        <CardDescription>Tasks assigned to you or needing your attention.</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="text-center py-6 text-muted-foreground">
          <p>No specific work items assigned.</p>
          <p className="text-sm">Tasks you need to work on will appear here.</p>
        </div>
        {/* Placeholder for tasks */}
      </CardContent>
    </Card>
  );
}
