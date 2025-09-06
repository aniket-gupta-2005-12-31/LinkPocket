'use server';

import { suggestCollectionsForLink } from '@/ai/flows/suggest-collections-for-link';
import { summarizeUrl } from '@/ai/flows/summarize-url';
import type { Collection } from '@/lib/types';

interface SuggestionInput {
  title: string;
  description: string;
  tags: string[];
  existingCollections: Collection[];
}

export async function getCollectionSuggestions({
  title,
  description,
  tags,
  existingCollections,
}: SuggestionInput): Promise<string[]> {
  if (!title && !description && tags.length === 0) {
    return [];
  }

  try {
    const response = await suggestCollectionsForLink({
      title,
      description,
      tags,
      existingCollectionNames: existingCollections.map(c => c.name),
    });
    
    return response.suggestedCollections;
  } catch (error) {
    console.error('Error getting collection suggestions:', error);
    // In a production app, you might want to handle this error more gracefully
    return [];
  }
}

export async function getLinkSummary(url: string): Promise<string> {
    if (!url) {
        return "";
    }

    try {
        const response = await summarizeUrl({ url });
        return response.summary;
    } catch (error) {
        console.error('Error getting link summary:', error);
        return "";
    }
}
