'use server';

/**
 * @fileOverview Summarize a URL.
 *
 * - summarizeUrl - A function that summarizes a URL.
 * - SummarizeUrlInput - The input type for the summarizeUrl function.
 * - SummarizeUrlOutput - The return type for the summarizeUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUrlInputSchema = z.object({
  url: z.string().url().describe('The URL to summarize.'),
});
export type SummarizeUrlInput = z.infer<typeof SummarizeUrlInputSchema>;

const SummarizeUrlOutputSchema = z.object({
  summary: z.string().describe('The summary of the URL.'),
});
export type SummarizeUrlOutput = z.infer<typeof SummarizeUrlOutputSchema>;

export async function summarizeUrl(input: SummarizeUrlInput): Promise<SummarizeUrlOutput> {
  return summarizeUrlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeUrlPrompt',
  input: {schema: SummarizeUrlInputSchema},
  output: {schema: SummarizeUrlOutputSchema},
  prompt: `You are a helpful assistant that summarizes web pages.

  Please provide a concise summary of the content at the following URL: {{{url}}}
  
  Focus on the main points and key information. The summary should be about 2-3 sentences long.
  `,
});

const summarizeUrlFlow = ai.defineFlow(
  {
    name: 'summarizeUrlFlow',
    inputSchema: SummarizeUrlInputSchema,
    outputSchema: SummarizeUrlOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
