
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck2 } from 'lucide-react';

export function AgendaCard() {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <CalendarCheck2 className="mr-3 h-6 w-6 text-primary" />
          Today's Agenda
        </CardTitle>
        <CardDescription>What's on your plate for today.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6 text-muted-foreground">
          <CalendarCheck2 className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="font-medium">Nothing scheduled for today yet.</p>
          <p className="text-sm">Events and tasks due today will automatically appear here to help you stay organized.</p>
        </div>
        {/* Placeholder for actual agenda items */}
      </CardContent>
    </Card>
  );
}
