export interface Author {
  name: string;
  avatarUrl: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  content: string;
  category: 'Tips' | 'News' | 'Newsroom';
  status: 'Published' | 'Draft';
  label?: 'Sponsored' | 'Most Read' | null;
  author?: Author;
  tags?: string[];
}
