'use server';
/**
 * @fileOverview Provides estimated flight and train ticket fares for a given city and currency.
 *
 * - getTicketFares - A function that returns estimated ticket fares.
 * - GetTicketFaresInput - The input type for the getTicketFares function.
 * - GetTicketFaresOutput - The return type for the getTicketFares function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetTicketFaresInputSchema = z.object({
  city: z.string().describe('The destination city.'),
  currency: z.string().describe('The currency for the fare estimates (e.g., "USD", "EUR", "INR", "JPY").'),
});
export type GetTicketFaresInput = z.infer<typeof GetTicketFaresInputSchema>;

const GetTicketFaresOutputSchema = z.object({
  flightFare: z.number().describe('The estimated flight fare for a one-way trip to the city in the specified currency.'),
  trainFare: z.number().describe('The estimated train fare for a one-way trip to the city in the specified currency. If not applicable, return 0.'),
  flightCompanies: z.array(z.string()).describe('An array of up to three suggested airline companies for the flight.'),
});
export type GetTicketFaresOutput = z.infer<typeof GetTicketFaresOutputSchema>;

export async function getTicketFares(input: GetTicketFaresInput): Promise<GetTicketFaresOutput> {
  return getTicketFaresFlow(input);
}

const getTicketFaresPrompt = ai.definePrompt({
  name: 'getTicketFaresPrompt',
  input: {schema: GetTicketFaresInputSchema},
  output: {schema: GetTicketFaresOutputSchema},
  prompt: `You are a travel agent providing fare estimates. Based on the destination city, estimate the average one-way fare for both a flight and a train ticket from a major nearby hub. Provide the fare in the requested currency. Also suggest up to three popular airline companies that fly to that city.

Destination: {{city}}
Currency: {{currency}}

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
