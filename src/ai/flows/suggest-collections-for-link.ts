'use server';

/**
 * @fileOverview Suggest collections for a given link based on its title, description, and tags.
 *
 * - suggestCollectionsForLink - A function that suggests collections for a link.
 * - SuggestCollectionsForLinkInput - The input type for the suggestCollectionsForLink function.
 * - SuggestCollectionsForLinkOutput - The return type for the suggestCollectionsForLink function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCollectionsForLinkInputSchema = z.object({
  title: z.string().describe('The title of the link.'),
  description: z.string().describe('The description of the link.'),
  tags: z.array(z.string()).describe('The tags associated with the link.'),
  existingCollectionNames: z.array(z.string()).describe('The names of the existing collections.'),
});
export type SuggestCollectionsForLinkInput = z.infer<typeof SuggestCollectionsForLinkInputSchema>;

const SuggestCollectionsForLinkOutputSchema = z.object({
  suggestedCollections: z
    .array(z.string())
    .describe('The names of the collections suggested for the link.'),
});
export type SuggestCollectionsForLinkOutput = z.infer<typeof SuggestCollectionsForLinkOutputSchema>;

export async function suggestCollectionsForLink(
  input: SuggestCollectionsForLinkInput
): Promise<SuggestCollectionsForLinkOutput> {
  return suggestCollectionsForLinkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCollectionsForLinkPrompt',
  input: {schema: SuggestCollectionsForLinkInputSchema},
  output: {schema: SuggestCollectionsForLinkOutputSchema},
  prompt: `You are a helpful assistant that suggests relevant collections for a given link based on its title, description, and tags.

  The user has the following existing collections: {{{existingCollectionNames}}}

  Suggest collections from the above list that would be a good fit for the following link:

  Title: {{{title}}}
  Description: {{{description}}}
  Tags: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  If no collections seem relevant, return an empty array.

  Return ONLY the names of the suggested collections.  Do not include any additional text in your response.
  `,
});

const suggestCollectionsForLinkFlow = ai.defineFlow(
  {
    name: 'suggestCollectionsForLinkFlow',
    inputSchema: SuggestCollectionsForLinkInputSchema,
    outputSchema: SuggestCollectionsForLinkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
