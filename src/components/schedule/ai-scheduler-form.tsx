"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { suggestOptimalTimes, type SuggestOptimalTimesInput, type SuggestOptimalTimesOutput } from "@/ai/flows/suggest-optimal-times";
import { useState, useTransition } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SuggestedTimeCard } from "./suggested-time-card";

const formSchema = z.object({
  taskName: z.string().min(2, "Task name must be at least 2 characters."),
  taskDurationMinutes: z.coerce.number().min(5, "Duration must be at least 5 minutes."),
  calendarData: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, "Must be valid JSON. Example: [{\"title\":\"Meeting\",\"startTime\":\"2024-08-15T10:00:00Z\",\"endTime\":\"2024-08-15T11:00:00Z\"}]"),
  productivityPatterns: z.string().min(10, "Describe your productivity patterns (at least 10 characters)."),
});

type AISchedulerFormValues = z.infer<typeof formSchema>;

export function AISchedulerForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<SuggestOptimalTimesOutput | null>(null);

  const form = useForm<AISchedulerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      taskDurationMinutes: 30,
      calendarData: "[]",
      productivityPatterns: "Most productive in the mornings, less focused after lunch.",
    },
  });

  async function onSubmit(values: AISchedulerFormValues) {
    startTransition(async () => {
      try {
        setSuggestions(null); // Clear previous suggestions
        const result = await suggestOptimalTimes(values);
        setSuggestions(result);
        toast({
          title: "Scheduling Suggestions Ready!",
          description: "Optimal times have been generated for your task.",
        });
      } catch (error) {
        console.error("AI Scheduling Error:", error);
        toast({
          title: "Error Generating Suggestions",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6 bg-card rounded-lg shadow-md">
          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Develop new feature" {...field} />
                </FormControl>
                <FormDescription>What task do you want to schedule?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taskDurationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 60" {...field} />
                </FormControl>
                <FormDescription>How long will this task take?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="calendarData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Existing Calendar Data (JSON format)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Example: [{"title":"Meeting","startTime":"2024-08-15T10:00:00Z","endTime":"2024-08-15T11:00:00Z"}]'
                    className="min-h-[100px] font-mono text-sm"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide your current calendar events as a JSON array. Each event should have 'title', 'startTime' (ISO string), and 'endTime' (ISO string).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productivityPatterns"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Productivity Patterns</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., I'm most focused from 9 AM to 12 PM. I prefer creative tasks in the morning and administrative tasks in the afternoon."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Describe when you are typically most and least productive.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Suggest Optimal Times
              </>
            )}
          </Button>
        </form>
      </Form>

      {isPending && (
        <div className="text-center py-8">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">AI is thinking... please wait.</p>
        </div>
      )}

      {suggestions && (
        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">AI Scheduling Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Reasoning:</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{suggestions.reasoning}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Suggested Times:</h4>
              {suggestions.suggestedTimes.length > 0 ? (
                 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {suggestions.suggestedTimes.map((time, index) => (
                    <SuggestedTimeCard key={index} time={time} taskName={form.getValues("taskName")} />
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No optimal times found based on the provided information.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
