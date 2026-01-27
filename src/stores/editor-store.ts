// src/stores/editor-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlogPost, ContentBlock, ImageData, SEOData, MetaData, RelatedPost } from '@/types';

interface EditorStore {
  // State
  post: BlogPost;
  isDirty: boolean;
  lastSaved: Date | null;
  isSaving: boolean;
  isPublishing: boolean;

  // Actions
  setTitle: (title: string) => void;
  setExcerpt: (excerpt: string) => void;
  setHeaderImageDesktop: (image: ImageData) => void;
  setHeaderImageMobile: (image: ImageData) => void;
  setFeaturedImage: (image: ImageData) => void;
  setUseFeaturedImageFromHeader: (use: boolean) => void;
  addBlock: (type?: 'text' | 'image') => void;
  updateBlock: (id: string, data: Partial<ContentBlock>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  setMeta: (meta: Partial<MetaData>) => void;
  setSEO: (seo: Partial<SEOData>) => void;
  setRelatedPosts: (posts: RelatedPost[]) => void;
  resetPost: () => void;
  loadFromStorage: () => void;
  setIsSaving: (isSaving: boolean) => void;
  setIsPublishing: (isPublishing: boolean) => void;
  markAsSaved: () => void;
}

// Initial empty state for a new blog post
const createEmptyPost = (): BlogPost => ({
  title: '',
  headerImageDesktop: {
    file: null,
    preview: '',
    alt: '',
    caption: '',
    description: '',
  },
  headerImageMobile: {
    file: null,
    preview: '',
    alt: '',
    caption: '',
    description: '',
  },
  featuredImage: {
    file: null,
    preview: '',
    alt: '',
    caption: '',
    description: '',
  },
  useFeaturedImageFromHeader: false,
  excerpt: '',
  blocks: [],
  meta: {
    date: new Date().toISOString(),
    author: '',
    categories: [],
    tags: [],
  },
  seo: {
    title: '',
    description: '',
    focusKeyword: '',
    slug: '',
  },
  relatedPosts: [],
});

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      // Initial state
      post: createEmptyPost(),
      isDirty: false,
      lastSaved: null,
      isSaving: false,
      isPublishing: false,

      // Actions
      setTitle: (title: string) =>
        set((state) => ({
          post: { ...state.post, title },
          isDirty: true,
        })),

      setExcerpt: (excerpt: string) =>
        set((state) => ({
          post: { ...state.post, excerpt },
          isDirty: true,
        })),

      setHeaderImageDesktop: (image: ImageData) =>
        set((state) => ({
          post: { ...state.post, headerImageDesktop: image },
          isDirty: true,
        })),

      setHeaderImageMobile: (image: ImageData) =>
        set((state) => ({
          post: { ...state.post, headerImageMobile: image },
          isDirty: true,
        })),

      setFeaturedImage: (image: ImageData) =>
        set((state) => ({
          post: { ...state.post, featuredImage: image },
          isDirty: true,
        })),

      setUseFeaturedImageFromHeader: (use: boolean) =>
        set((state) => ({
          post: { ...state.post, useFeaturedImageFromHeader: use },
          isDirty: true,
        })),

      addBlock: (type: 'text' | 'image' = 'text') =>
        set((state) => {
          const newBlock: ContentBlock = {
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            ...(type === 'text'
              ? { headline: '', content: '' }
              : {
                  image: {
                    file: null,
                    preview: '',
                    alt: '',
                    caption: '',
                    description: '',
                  },
                }),
          };
          return {
            post: {
              ...state.post,
              blocks: [...state.post.blocks, newBlock],
            },
            isDirty: true,
          };
        }),

      updateBlock: (id: string, data: Partial<ContentBlock>) =>
        set((state) => ({
          post: {
            ...state.post,
            blocks: state.post.blocks.map((block) =>
              block.id === id ? { ...block, ...data } : block
            ),
          },
          isDirty: true,
        })),

      removeBlock: (id: string) =>
        set((state) => ({
          post: {
            ...state.post,
            blocks: state.post.blocks.filter((block) => block.id !== id),
          },
          isDirty: true,
        })),

      reorderBlocks: (fromIndex: number, toIndex: number) =>
        set((state) => {
          const blocks = [...state.post.blocks];
          const [removed] = blocks.splice(fromIndex, 1);
          blocks.splice(toIndex, 0, removed);
          return {
            post: { ...state.post, blocks },
            isDirty: true,
          };
        }),

      setMeta: (meta: Partial<MetaData>) =>
        set((state) => ({
          post: {
            ...state.post,
            meta: { ...state.post.meta, ...meta },
          },
          isDirty: true,
        })),

      setSEO: (seo: Partial<SEOData>) =>
        set((state) => ({
          post: {
            ...state.post,
            seo: { ...state.post.seo, ...seo },
          },
          isDirty: true,
        })),

      setRelatedPosts: (posts: RelatedPost[]) =>
        set((state) => ({
          post: { ...state.post, relatedPosts: posts },
          isDirty: true,
        })),

      resetPost: () =>
        set({
          post: createEmptyPost(),
          isDirty: false,
          lastSaved: null,
          isSaving: false,
          isPublishing: false,
        }),

      loadFromStorage: () => {
        // This is handled automatically by the persist middleware
        // but we expose this method in case we need to manually trigger it
        const state = get();
        return state;
      },

      setIsSaving: (isSaving: boolean) => set({ isSaving }),

      setIsPublishing: (isPublishing: boolean) => set({ isPublishing }),

      markAsSaved: () =>
        set({
          isDirty: false,
          lastSaved: new Date(),
        }),
    }),
    {
      name: 'dnm-blog-editor-storage', // LocalStorage key
      partialize: (state) => ({
        // Only persist the post data, not the UI states
        post: state.post,
        lastSaved: state.lastSaved,
      }),
    }
  )
);
