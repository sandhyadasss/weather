'use server';
/**
 * @fileOverview Provides a travel safety suggestion based on weather conditions.
 *
 * - getTravelSuggestion - A function that returns a travel suggestion.
 * - TravelSuggestionInput - The input type for the getTravelSuggestion function.
 * - TravelSuggestionOutput - The return type for the getTravelSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TravelSuggestionInputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  windSpeed: z.number().describe('The current wind speed in km/h.'),
  weatherDescription: z.string().describe('A brief description of the current weather conditions.'),
});
export type TravelSuggestionInput = z.infer<typeof TravelSuggestionInputSchema>;

const TravelSuggestionOutputSchema = z.object({
    suggestion: z.string().describe("A short suggestion on whether it's safe to travel."),
    safetyLevel: z.enum(['Safe', 'Caution', 'Dangerous']).describe("An assessment of the travel safety level."),
});
export type TravelSuggestionOutput = z.infer<typeof TravelSuggestionOutputSchema>;

export async function getTravelSuggestion(input: TravelSuggestionInput): Promise<TravelSuggestionOutput> {
  return travelSuggestionFlow(input);
}

const travelSuggestionPrompt = ai.definePrompt({
  name: 'travelSuggestionPrompt',
  input: {schema: TravelSuggestionInputSchema},
  output: {schema: TravelSuggestionOutputSchema},
  prompt: `You are a travel safety advisor. Based on the following weather conditions, provide a concise travel suggestion and a safety level.

  - Temperature: {{temperature}}°C
  - Wind Speed: {{windSpeed}} km/h
  - Weather Description: {{weatherDescription}}
  
  Consider factors like extreme temperatures, high winds, or hazardous conditions (like thunderstorms or snow).
  
  For example:
  - Sunny and mild: "Looks like a great day for a trip!", safety level 'Safe'.
  - Heavy rain and wind: "Roads might be slippery. Drive with caution.", safety level 'Caution'.
  - Thunderstorm or heavy snow: "It's best to stay indoors until the storm passes.", safety level 'Dangerous'.
  
  Provide a single sentence for the suggestion.`,
});

const travelSuggestionFlow = ai.defineFlow(
  {
    name: 'travelSuggestionFlow',
    inputSchema: TravelSuggestionInputSchema,
    outputSchema: TravelSuggestionOutputSchema,
  },
  async input => {
    const {output} = await travelSuggestionPrompt(input);
    return output!;
  }
);
