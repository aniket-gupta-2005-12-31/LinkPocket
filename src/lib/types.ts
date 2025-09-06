export interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  collectionId: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  linkCount: number;
}
