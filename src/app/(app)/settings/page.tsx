
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Settings, Calendar as CalendarIconLucide } from 'lucide-react'; // Renamed Calendar to avoid conflict

export default function SettingsPage() {
  const { toast } = useToast();

  const handleGoogleCalendarImport = () => {
    toast({
      title: "Coming Soon!",
      description: "Google Calendar integration is under development.",
    });
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <Settings className="mr-3 h-8 w-8 text-primary" />
          Settings
        </h2>
      </div>
      <p className="text-muted-foreground">
        Manage your application preferences and integrations.
      </p>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Connect your external accounts and services.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
            <div className='mb-3 sm:mb-0'>
              <div className="flex items-center font-semibold mb-1">
                <CalendarIconLucide className="mr-2 h-5 w-5 text-primary" />
                Google Calendar
              </div>
              <p className="text-sm text-muted-foreground">
                Import your events from Google Calendar to keep everything in sync.
              </p>
            </div>
            <Button onClick={handleGoogleCalendarImport}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Connect Google Calendar
            </Button>
          </div>
          {/* Add more integration settings here */}
        </CardContent>
      </Card>
      
      {/* Example of another settings card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of Antikythera Scheduler.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Theme settings are available in the header via the Sun/Moon icon. More appearance options coming soon.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
