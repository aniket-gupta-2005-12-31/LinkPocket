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
  suggestedExistingCollections: z
    .array(z.string())
    .describe('The names of existing collections suggested for the link.'),
  suggestedNewCollections: z
    .array(z.string())
    .describe(
      'The names of new collections suggested for the link. These should be short, 1-3 word titles.'
    ),
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

  The user has the following existing collections:
  {{#if existingCollectionNames}}
  {{#each existingCollectionNames}}
  - {{{this}}}
  {{/each}}
  {{else}}
  (No existing collections)
  {{/if}}

  Analyze the link details below:
  Title: {{{title}}}
  Description: {{{description}}}
  Tags: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  1.  **Suggest Existing Collections**: From the user's list, suggest 1-2 collections that are a good fit. If none are a good fit, return an empty array for \`suggestedExistingCollections\`.
  2.  **Suggest New Collections**: If the link doesn't fit well into the existing collections, suggest 1-2 *new* collection names. These names should be short and concise (e.g., "Web Development", "UI Inspiration", "Productivity Tools"). If the link fits perfectly into existing collections, you can return an empty array for \`suggestedNewCollections\`.

  Return ONLY the JSON object with the suggested collection names. Do not include any additional text in your response.
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
    return (
      output || {suggestedExistingCollections: [], suggestedNewCollections: []}
    );
  }
);
