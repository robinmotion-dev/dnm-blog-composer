// src/lib/wordpress.ts

import axios, { AxiosError } from 'axios';
import { BlogPost, ContentBlock } from '@/types';

// WordPress REST API Types
export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  caption: {
    rendered: string;
  };
  description: {
    rendered: string;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
}

export interface WPPost {
  id: number;
  title: {
    rendered: string;
  };
  slug: string;
  status: 'draft' | 'publish' | 'pending';
  link: string;
}

export interface WPError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}

// WordPress API Client Configuration
const WP_URL = process.env.NEXT_PUBLIC_WP_URL || process.env.WP_URL || '';
const WP_REST_URL = process.env.NEXT_PUBLIC_WP_REST_URL || process.env.WP_REST_URL || '';
const WP_USER = process.env.WP_USER || '';
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || '';

// Basic Auth Header
const getAuthHeader = () => {
  const credentials = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');
  return {
    Authorization: `Basic ${credentials}`,
  };
};

/**
 * Upload media file to WordPress
 */
export async function uploadMedia(file: File): Promise<WPMedia> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${WP_REST_URL}/media`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw handleWPError(error, 'Failed to upload media');
  }
}

/**
 * Get all categories from WordPress
 */
export async function getCategories(): Promise<WPCategory[]> {
  try {
    const response = await axios.get(`${WP_REST_URL}/categories`, {
      params: {
        per_page: 100,
      },
    });

    return response.data;
  } catch (error) {
    throw handleWPError(error, 'Failed to fetch categories');
  }
}

/**
 * Get all tags from WordPress
 */
export async function getTags(): Promise<WPTag[]> {
  try {
    const response = await axios.get(`${WP_REST_URL}/tags`, {
      params: {
        per_page: 100,
      },
    });

    return response.data;
  } catch (error) {
    throw handleWPError(error, 'Failed to fetch tags');
  }
}

/**
 * Get posts for Related Posts selection
 */
export async function getPosts(search?: string): Promise<WPPost[]> {
  try {
    const response = await axios.get(`${WP_REST_URL}/posts`, {
      params: {
        per_page: 20,
        status: 'publish',
        ...(search && { search }),
      },
    });

    return response.data;
  } catch (error) {
    throw handleWPError(error, 'Failed to fetch posts');
  }
}

/**
 * Create a draft post in WordPress
 */
export async function createDraft(post: BlogPost): Promise<WPPost> {
  try {
    // Prepare the post data
    const postData = {
      title: post.title,
      content: buildContentHTML(post),
      excerpt: post.excerpt,
      status: 'draft',
      categories: [], // Will be mapped from category names to IDs
      tags: [], // Will be mapped from tag names to IDs
      meta: {
        // ACF fields will go here
      },
    };

    const response = await axios.post(`${WP_REST_URL}/posts`, postData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw handleWPError(error, 'Failed to create draft');
  }
}

/**
 * Build HTML content from BlogPost blocks
 */
function buildContentHTML(post: BlogPost): string {
  let html = '';

  // Add header images (can be added to ACF or as HTML)
  // For now, we'll handle them separately through ACF

  // Build content from blocks
  for (const block of post.blocks) {
    if (block.type === 'text') {
      if (block.headline) {
        html += `<h2>${block.headline}</h2>\n`;
      }
      if (block.content) {
        html += `${block.content}\n`;
      }
    } else if (block.type === 'image' && block.image?.preview) {
      // Image blocks will need to be uploaded first
      // For now, we'll create a placeholder
      html += `<!-- IMAGE BLOCK: ${block.id} -->\n`;
    }
  }

  return html;
}

/**
 * Handle WordPress API errors
 */
function handleWPError(error: unknown, defaultMessage: string): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<WPError>;

    if (axiosError.response?.data) {
      const wpError = axiosError.response.data;
      return new Error(`${defaultMessage}: ${wpError.message || wpError.code}`);
    }

    if (axiosError.message) {
      return new Error(`${defaultMessage}: ${axiosError.message}`);
    }
  }

  if (error instanceof Error) {
    return new Error(`${defaultMessage}: ${error.message}`);
  }

  return new Error(defaultMessage);
}

/**
 * Check if WordPress API is reachable
 */
export async function checkWPConnection(): Promise<boolean> {
  try {
    const response = await axios.get(WP_REST_URL);
    return response.status === 200;
  } catch (error) {
    console.error('WordPress connection failed:', error);
    return false;
  }
}
