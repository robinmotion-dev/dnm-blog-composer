// src/types/index.ts

export interface ImageData {
  file: File | null;
  preview: string;
  alt: string;
  caption: string;
  description: string;
}

export interface ContentBlock {
  id: string;
  headline: string;
  content: string; // HTML from Tiptap
}

export interface SEOData {
  title: string;
  description: string;
  focusKeyword: string;
  slug: string;
}

export interface MetaData {
  date: string;
  author: string;
  categories: string[];
  tags: string[];
}

export interface RelatedPost {
  id: number;
  title: string;
}

export interface BlogPost {
  title: string;
  headerImageDesktop: ImageData;
  headerImageMobile: ImageData;
  featuredImage: ImageData;
  useFeaturedImageFromHeader: boolean;
  excerpt: string;
  blocks: ContentBlock[];
  meta: MetaData;
  seo: SEOData;
  relatedPosts: RelatedPost[];
}

export interface EditorState {
  post: BlogPost;
  isDirty: boolean;
  lastSaved: Date | null;
  isSaving: boolean;
  isPublishing: boolean;
}
