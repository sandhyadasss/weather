'use server';
/**
 * @fileOverview Provides suggestions for nearby places to visit based on a city and current weather.
 *
 * - suggestPlaces - A function that returns a list of suggested places.
 * - SuggestPlacesInput - The input type for the suggestPlaces function.
 * - SuggestPlacesOutput - The return type for the suggestPlaces function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPlacesInputSchema = z.object({
  city: z.string().describe('The city for which to suggest places.'),
  weatherDescription: z.string().describe('A brief description of the current weather conditions (e.g., "Sunny", "Rainy").'),
});
export type SuggestPlacesInput = z.infer<typeof SuggestPlacesInputSchema>;

const PlaceSchema = z.object({
  name: z.string().describe('The name of the suggested place.'),
  description: z.string().describe('A brief, one-sentence description of the place.'),
  idealWeather: z.enum(["Sunny", "Cloudy", "Rain", "Snow", "Partly cloudy", "Thunderstorm"]).describe('The ideal weather condition for visiting this place.'),
});

const SuggestPlacesOutputSchema = z.object({
  places: z.array(PlaceSchema).describe('An array of up to three suggested places to visit.'),
});
export type SuggestPlacesOutput = z.infer<typeof SuggestPlacesOutputSchema>;

export async function suggestPlaces(input: SuggestPlacesInput): Promise<SuggestPlacesOutput> {
  return suggestPlacesFlow(input);
}

const suggestPlacesPrompt = ai.definePrompt({
  name: 'suggestPlacesPrompt',
  input: {schema: SuggestPlacesInputSchema},
  output: {schema: SuggestPlacesOutputSchema},
  prompt: `You are a helpful travel assistant. Based on the city and weather provided, suggest up to three interesting places to visit nearby. The suggestions should be appropriate for the weather. For example, suggest indoor activities like museums or cafes if it is raining, and outdoor activities like parks or landmarks if it is sunny.

City: {{city}}
Weather: {{weatherDescription}}

For each place, provide a name, a short, one-sentence description, and the ideal weather to visit.`,
});

const suggestPlacesFlow = ai.defineFlow(
  {
    name: 'suggestPlacesFlow',
    inputSchema: SuggestPlacesInputSchema,
    outputSchema: SuggestPlacesOutputSchema,
  },
  async input => {
    const {output} = await suggestPlacesPrompt(input);
    return output!;
  }
);
