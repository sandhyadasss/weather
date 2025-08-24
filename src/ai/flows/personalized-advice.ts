'use server';
/**
 * @fileOverview Provides personalized advice based on the current weather conditions.
 *
 * - getPersonalizedAdvice - A function that returns personalized advice based on the weather.
 * - PersonalizedAdviceInput - The input type for the getPersonalizedAdvice function.
 * - PersonalizedAdviceOutput - The return type for the getPersonalizedAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedAdviceInputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  humidity: z.number().describe('The current humidity as a percentage.'),
  windSpeed: z.number().describe('The current wind speed in km/h.'),
  weatherDescription: z.string().describe('A brief description of the current weather conditions.'),
});
export type PersonalizedAdviceInput = z.infer<typeof PersonalizedAdviceInputSchema>;

const PersonalizedAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized advice based on the current weather conditions.'),
});
export type PersonalizedAdviceOutput = z.infer<typeof PersonalizedAdviceOutputSchema>;

export async function getPersonalizedAdvice(input: PersonalizedAdviceInput): Promise<PersonalizedAdviceOutput> {
  return personalizedAdviceFlow(input);
}

const personalizedAdvicePrompt = ai.definePrompt({
  name: 'personalizedAdvicePrompt',
  input: {schema: PersonalizedAdviceInputSchema},
  output: {schema: PersonalizedAdviceOutputSchema},
  prompt: `You are a helpful assistant providing personalized advice based on the current weather conditions.

  Based on the following weather conditions:
  - Temperature: {{temperature}}°C
  - Humidity: {{humidity}}%
  - Wind Speed: {{windSpeed}} km/h
  - Weather Description: {{weatherDescription}}

  Provide a single sentence of personalized advice to the user. For example, if it is cold, tell them to wear a jacket. If it is raining, tell them to bring an umbrella.`,
});

const personalizedAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedAdviceFlow',
    inputSchema: PersonalizedAdviceInputSchema,
    outputSchema: PersonalizedAdviceOutputSchema,
  },
  async input => {
    const {output} = await personalizedAdvicePrompt(input);
    return output!;
  }
);
