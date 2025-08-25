'use server';
/**
 * @fileOverview Provides hotel suggestions for a given city and currency.
 *
 * - getHotelSuggestions - A function that returns a list of hotel suggestions.
 * - GetHotelSuggestionsInput - The input type for the getHotelSuggestions function.
 * - GetHotelSuggestionsOutput - The return type for the getHotelSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetHotelSuggestionsInputSchema = z.object({
  city: z.string().describe('The city for which to suggest hotels.'),
  currency: z.string().describe('The currency for the price estimates (e.g., "USD", "EUR", "INR", "JPY").'),
});
export type GetHotelSuggestionsInput = z.infer<typeof GetHotelSuggestionsInputSchema>;

const HotelSchema = z.object({
    name: z.string().describe('The name of the suggested hotel.'),
    price: z.number().describe('The estimated price per night in the specified currency.'),
    description: z.string().describe('A brief, one-sentence description of the hotel.'),
});

const GetHotelSuggestionsOutputSchema = z.object({
  hotels: z.array(HotelSchema).describe('An array of up to three suggested hotels.'),
});
export type GetHotelSuggestionsOutput = z.infer<typeof GetHotelSuggestionsOutputSchema>;

export async function getHotelSuggestions(input: GetHotelSuggestionsInput): Promise<GetHotelSuggestionsOutput> {
  return getHotelSuggestionsFlow(input);
}

const getHotelSuggestionsPrompt = ai.definePrompt({
  name: 'getHotelSuggestionsPrompt',
  input: {schema: GetHotelSuggestionsInputSchema},
  output: {schema: GetHotelSuggestionsOutputSchema},
  prompt: `You are a helpful travel assistant. Based on the city provided, suggest up to three hotels. For each hotel, provide a name, an estimated price per night in the specified currency, and a short, one-sentence description.

City: {{city}}
Currency: {{currency}}
`,
});

const getHotelSuggestionsFlow = ai.defineFlow(
  {
    name: 'getHotelSuggestionsFlow',
    inputSchema: GetHotelSuggestionsInputSchema,
    outputSchema: GetHotelSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await getHotelSuggestionsPrompt(input);
    return output!;
  }
);
