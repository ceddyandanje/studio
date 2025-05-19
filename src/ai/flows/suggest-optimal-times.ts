'use server';

/**
 * @fileOverview Suggests optimal times for scheduling new tasks by analyzing the user's calendar and productivity patterns.
 *
 * - suggestOptimalTimes - A function that suggests optimal times for scheduling tasks.
 * - SuggestOptimalTimesInput - The input type for the suggestOptimalTimes function.
 * - SuggestOptimalTimesOutput - The return type for the suggestOptimalTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalTimesInputSchema = z.object({
  taskName: z.string().describe('The name of the task to schedule.'),
  taskDurationMinutes: z.number().describe('The duration of the task in minutes.'),
  calendarData: z.string().describe('The user\'s calendar data in JSON format, including existing events with start and end times.'),
  productivityPatterns: z
    .string()
    .describe(
      'A description of the user\'s typical productivity patterns, including times of day when they are most and least productive.'
    ),
});
export type SuggestOptimalTimesInput = z.infer<typeof SuggestOptimalTimesInputSchema>;

const SuggestOptimalTimesOutputSchema = z.object({
  suggestedTimes: z
    .array(z.string())
    .describe(
      'An array of suggested times for scheduling the task, in ISO 8601 format (e.g., 2024-01-01T10:00:00Z).'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief explanation of why these times were suggested, based on the user\'s calendar and productivity patterns.'
    ),
});
export type SuggestOptimalTimesOutput = z.infer<typeof SuggestOptimalTimesOutputSchema>;

export async function suggestOptimalTimes(input: SuggestOptimalTimesInput): Promise<SuggestOptimalTimesOutput> {
  return suggestOptimalTimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalTimesPrompt',
  input: {schema: SuggestOptimalTimesInputSchema},
  output: {schema: SuggestOptimalTimesOutputSchema},
  prompt: `You are an AI assistant designed to suggest optimal times for scheduling tasks.

  Analyze the user's calendar data and productivity patterns to find the best times to schedule the task.
  Consider the task duration when suggesting times.
  Respond with suggested times in ISO 8601 format and explain your reasoning.

  Task Name: {{{taskName}}}
  Task Duration (minutes): {{{taskDurationMinutes}}}
  Calendar Data: {{{calendarData}}}
  Productivity Patterns: {{{productivityPatterns}}}

  Output suggested times in ISO 8601 format, such as 2024-01-01T10:00:00Z.
  Include a short explanation of why those times were optimal in the 'reasoning' field.
  `,
});

const suggestOptimalTimesFlow = ai.defineFlow(
  {
    name: 'suggestOptimalTimesFlow',
    inputSchema: SuggestOptimalTimesInputSchema,
    outputSchema: SuggestOptimalTimesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
