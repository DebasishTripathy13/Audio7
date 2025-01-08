export interface Summary {
  text: string;
  timestamp: string;
  references: Reference[];
}

export interface Reference {
  title: string;
  url?: string;
  type: 'document' | 'link' | 'note';
}