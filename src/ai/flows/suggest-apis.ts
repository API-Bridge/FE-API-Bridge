// This file holds the Genkit flow for suggesting APIs based on a user's description of needed data.

'use server';

/**
 * @fileOverview An AI agent that suggests APIs based on a user's data needs.
 *
 * - suggestApis - A function that suggests relevant APIs based on a description.
 * - SuggestApisInput - The input type for the suggestApis function.
 * - SuggestApisOutput - The return type for the suggestApis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestApisInputSchema = z.object({
  dataDescription: z.string().describe('A description of the data the user needs.'),
});
export type SuggestApisInput = z.infer<typeof SuggestApisInputSchema>;

const SuggestApisOutputSchema = z.object({
  apiSuggestions: z
    .array(z.string())
    .describe('A list of suggested APIs that can provide the requested data.'),
});
export type SuggestApisOutput = z.infer<typeof SuggestApisOutputSchema>;

export async function suggestApis(input: SuggestApisInput): Promise<SuggestApisOutput> {
  return suggestApisFlow(input);
}

const suggestApisPrompt = ai.definePrompt({
  name: 'suggestApisPrompt',
  input: {schema: SuggestApisInputSchema},
  output: {schema: SuggestApisOutputSchema},
  prompt: `You are an expert API suggestion engine. Given a description of the data a user needs, you will suggest a list of APIs that can provide that data.

Data Description: {{{dataDescription}}}

Suggest APIs:
`,
});

const suggestApisFlow = ai.defineFlow(
  {
    name: 'suggestApisFlow',
    inputSchema: SuggestApisInputSchema,
    outputSchema: SuggestApisOutputSchema,
  },
  async input => {
    const {output} = await suggestApisPrompt(input);
    return output!;
  }
);
