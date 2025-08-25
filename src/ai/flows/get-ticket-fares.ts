'use server';
/**
 * @fileOverview Provides estimated flight and train ticket fares for a given city.
 *
 * - getTicketFares - A function that returns estimated ticket fares.
 * - GetTicketFaresInput - The input type for the getTicketFares function.
 * - GetTicketFaresOutput - The return type for the getTicketFares function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetTicketFaresInputSchema = z.object({
  city: z.string().describe('The destination city.'),
});
export type GetTicketFaresInput = z.infer<typeof GetTicketFaresInputSchema>;

const GetTicketFaresOutputSchema = z.object({
  flightFare: z.number().describe('The estimated flight fare for a one-way trip to the city in USD.'),
  trainFare: z.number().describe('The estimated train fare for a one-way trip to the city in USD. If not applicable, return 0.'),
});
export type GetTicketFaresOutput = z.infer<typeof GetTicketFaresOutputSchema>;

export async function getTicketFares(input: GetTicketFaresInput): Promise<GetTicketFaresOutput> {
  return getTicketFaresFlow(input);
}

const getTicketFaresPrompt = ai.definePrompt({
  name: 'getTicketFaresPrompt',
  input: {schema: GetTicketFaresInputSchema},
  output: {schema: GetTicketFaresOutputSchema},
  prompt: `You are a travel agent providing fare estimates. Based on the destination city, estimate the average one-way fare in USD for both a flight and a train ticket from a major nearby hub.

Destination: {{city}}

Provide a reasonable, non-zero estimate for flight fare. If train travel to this city is not common or practical (e.g., it's on a different continent), set the trainFare to 0.`,
});

const getTicketFaresFlow = ai.defineFlow(
  {
    name: 'getTicketFaresFlow',
    inputSchema: GetTicketFaresInputSchema,
    outputSchema: GetTicketFaresOutputSchema,
  },
  async input => {
    const {output} = await getTicketFaresPrompt(input);
    return output!;
  }
);
