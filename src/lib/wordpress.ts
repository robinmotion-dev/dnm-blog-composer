// src/lib/wordpress.ts

import axios, { AxiosError } from 'axios';
import { BlogPost, ContentBlock, ImageData } from '@/types';

// =============================================================================
// WORDPRESS REST API TYPES
// =============================================================================

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  caption: { rendered: string };
  description: { rendered: string };
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
  title: { rendered: string };
  slug: string;
  status: 'draft' | 'publish' | 'pending';
  link: string;
}

export interface WPError {
  code: string;
  message: string;
  data?: { status: number };
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const WP_URL = process.env.NEXT_PUBLIC_WP_URL || process.env.WP_URL || '';
const WP_REST_URL = process.env.NEXT_PUBLIC_WP_REST_URL || process.env.WP_REST_URL || '';
const WP_USER = process.env.WP_USER || '';
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || '';

const getAuthHeader = () => {
  const credentials = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');
  return { Authorization: `Basic ${credentials}` };
};

// =============================================================================
// ACF BLOCK FIELD IDS (from your WordPress installation)
// =============================================================================

const FIELD_IDS = {
  // Blog Hero Block
  blogHero: {
    image: 'field_6308b9807dfe5',
    mobileImage: 'field_6308b98f7dfe6',
    post: 'field_6322de3f6c2a7',
    date: 'field_640664705a3fa',
    author: 'field_63bef8f0114d2',
    category: 'field_64066558f20b2',
  },
  // Intro Text Block (Content Blocks)
  introText: {
    headline: 'field_64b7efe0ba1c3',
    content: 'field_62610ddb9a17b',
    offset: 'field_64b7f00fba1c4',
  },
  // CTA Block
  cta: {
    headline: 'field_626905a06e09a',
    content: 'field_626905ac6e09b',
    image: 'field_626905b16e09c',
  },
  // Recommended Content Module
  recommendedContent: {
    headline: 'field_62d93a6ce366b',
    recommendedPosts: 'field_62d93a7be366c',
  },
  // Common margin/padding fields (shared across blocks)
  common: {
    mobileMarginTop: 'field_5ed62d8f1903b',
    desktopMarginTop: 'field_5ed62dc31903c',
    mobileMarginBottom: 'field_5ed62de41903d',
    desktopMarginBottom: 'field_5ed62df71903e',
    anchor: 'field_5ed62d8f5503b',
    paddingTopDesktop: 'field_62509e7c3d718',
    paddingTopMobile: 'field_62509ebd3d71b',
    paddingBottomDesktop: 'field_62509ec93d71c',
    paddingBottomMobile: 'field_62509ed83d71d',
    backgroundColor: 'field_628770b1ab11a',
  },
};

// Default margin/padding values
const DEFAULT_SPACING = {
  mobileMarginTop: '40',
  desktopMarginTop: '80',
  mobileMarginBottom: '40',
  desktopMarginBottom: '80',
  anchor: '',
  paddingTopDesktop: '0',
  paddingTopMobile: '0',
  paddingBottomDesktop: '0',
  paddingBottomMobile: '0',
  backgroundColor: '',
};

// Hero block uses different default spacing
const HERO_SPACING = {
  mobileMarginTop: '50',
  desktopMarginTop: '100',
  mobileMarginBottom: '50',
  desktopMarginBottom: '100',
  anchor: '',
  paddingTopDesktop: '0',
  paddingTopMobile: '0',
  paddingBottomDesktop: '0',
  paddingBottomMobile: '0',
  backgroundColor: '',
};

// =============================================================================
// MEDIA UPLOAD
// =============================================================================

/**
 * Upload media file to WordPress
 */
export async function uploadMedia(file: File): Promise<WPMedia> {
  // Validate that file is actually a File object
  if (!file || !(file instanceof File)) {
    console.error('[uploadMedia] Invalid file object:', file);
    throw new Error('Invalid file object provided for upload');
  }

  // Validate file size
  if (file.size === 0) {
    console.error('[uploadMedia] File is empty:', file.name);
    throw new Error('File is empty and cannot be uploaded');
  }

  console.log('[uploadMedia] Uploading file:', {
    name: file.name,
    size: file.size,
    type: file.type,
  });

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${WP_REST_URL}/media`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[uploadMedia] Upload successful, media ID:', response.data.id);
    return response.data;
  } catch (error) {
    console.error('[uploadMedia] Upload failed:', error);
    throw handleWPError(error, 'Failed to upload media');
  }
}

/**
 * Upload media and update its metadata (alt, caption, description)
 */
export async function uploadMediaWithMeta(imageData: ImageData): Promise<number | null> {
  console.log('[uploadMediaWithMeta] ImageData:', {
    hasFile: !!imageData.file,
    wpMediaId: imageData.wpMediaId,
    preview: imageData.preview ? imageData.preview.substring(0, 50) : null,
  });

  // If image already uploaded, return existing ID
  if (imageData.wpMediaId) {
    console.log('[uploadMediaWithMeta] Using existing Media ID:', imageData.wpMediaId);
    return imageData.wpMediaId;
  }

  // If no file to upload, return null
  if (!imageData.file) {
    console.log('[uploadMediaWithMeta] No file to upload, returning null');
    return null;
  }

  try {
    // 1. Upload the file
    const media = await uploadMedia(imageData.file);

    // 2. Update metadata
    await axios.post(
      `${WP_REST_URL}/media/${media.id}`,
      {
        alt_text: imageData.alt || '',
        caption: imageData.caption || '',
        description: imageData.description || '',
      },
      {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
      }
    );

    return media.id;
  } catch (error) {
    console.error('Failed to upload media with meta:', error);
    throw error;
  }
}

/**
 * Update metadata for an existing media item
 */
export async function updateMediaMeta(
  mediaId: number,
  meta: { alt?: string; caption?: string; description?: string }
): Promise<void> {
  await axios.post(
    `${WP_REST_URL}/media/${mediaId}`,
    {
      alt_text: meta.alt || '',
      caption: meta.caption || '',
      description: meta.description || '',
    },
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );
}

// =============================================================================
// FETCH DATA
// =============================================================================

/**
 * Get all categories from WordPress
 */
export async function getCategories(): Promise<WPCategory[]> {
  try {
    const response = await axios.get(`${WP_REST_URL}/categories`, {
      params: { per_page: 100 },
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
      params: { per_page: 100 },
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
 * Get media URL by attachment ID
 */
async function getMediaUrl(mediaId: number): Promise<string> {
  try {
    const response = await axios.get(`${WP_REST_URL}/media/${mediaId}`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    return response.data?.source_url || '';
  } catch (error) {
    console.error('Failed to fetch media URL:', error);
    return '';
  }
}

/**
 * Get category IDs from category names
 */
async function getCategoryIds(categoryNames: string[]): Promise<number[]> {
  if (!categoryNames || categoryNames.length === 0) return [];
  
  const allCategories = await getCategories();
  const ids: number[] = [];
  
  for (const name of categoryNames) {
    const found = allCategories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase() || 
               cat.slug.toLowerCase() === name.toLowerCase()
    );
    if (found) ids.push(found.id);
  }
  
  return ids;
}

/**
 * Get or create tags and return their IDs
 */
async function getOrCreateTagIds(tagNames: string[]): Promise<number[]> {
  if (!tagNames || tagNames.length === 0) return [];
  
  const ids: number[] = [];
  
  for (const name of tagNames) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    
    try {
      // Try to find existing tag
      const response = await axios.get(`${WP_REST_URL}/tags`, {
        params: { search: trimmed, per_page: 1 },
      });
      
      if (response.data.length > 0 && 
          response.data[0].name.toLowerCase() === trimmed.toLowerCase()) {
        ids.push(response.data[0].id);
      } else {
        // Create new tag
        const newTag = await axios.post(
          `${WP_REST_URL}/tags`,
          { name: trimmed },
          { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } }
        );
        ids.push(newTag.data.id);
      }
    } catch (error) {
      console.error(`Failed to get/create tag "${trimmed}":`, error);
    }
  }
  
  return ids;
}

// =============================================================================
// GUTENBERG BLOCK BUILDERS
// =============================================================================

/**
 * Build common spacing data for blocks
 */
function buildSpacingData(spacing: typeof DEFAULT_SPACING = DEFAULT_SPACING): Record<string, string> {
  return {
    [`${FIELD_IDS.common.mobileMarginTop}`]: spacing.mobileMarginTop,
    [`_${FIELD_IDS.common.mobileMarginTop.replace('field_', '')}`]: FIELD_IDS.common.mobileMarginTop,
    [`${FIELD_IDS.common.desktopMarginTop}`]: spacing.desktopMarginTop,
    [`_${FIELD_IDS.common.desktopMarginTop.replace('field_', '')}`]: FIELD_IDS.common.desktopMarginTop,
    [`${FIELD_IDS.common.mobileMarginBottom}`]: spacing.mobileMarginBottom,
    [`_${FIELD_IDS.common.mobileMarginBottom.replace('field_', '')}`]: FIELD_IDS.common.mobileMarginBottom,
    [`${FIELD_IDS.common.desktopMarginBottom}`]: spacing.desktopMarginBottom,
    [`_${FIELD_IDS.common.desktopMarginBottom.replace('field_', '')}`]: FIELD_IDS.common.desktopMarginBottom,
    [`${FIELD_IDS.common.anchor}`]: spacing.anchor,
    [`_${FIELD_IDS.common.anchor.replace('field_', '')}`]: FIELD_IDS.common.anchor,
    [`${FIELD_IDS.common.paddingTopDesktop}`]: spacing.paddingTopDesktop,
    [`_${FIELD_IDS.common.paddingTopDesktop.replace('field_', '')}`]: FIELD_IDS.common.paddingTopDesktop,
    [`${FIELD_IDS.common.paddingTopMobile}`]: spacing.paddingTopMobile,
    [`_${FIELD_IDS.common.paddingTopMobile.replace('field_', '')}`]: FIELD_IDS.common.paddingTopMobile,
    [`${FIELD_IDS.common.paddingBottomDesktop}`]: spacing.paddingBottomDesktop,
    [`_${FIELD_IDS.common.paddingBottomDesktop.replace('field_', '')}`]: FIELD_IDS.common.paddingBottomDesktop,
    [`${FIELD_IDS.common.paddingBottomMobile}`]: spacing.paddingBottomMobile,
    [`_${FIELD_IDS.common.paddingBottomMobile.replace('field_', '')}`]: FIELD_IDS.common.paddingBottomMobile,
    [`${FIELD_IDS.common.backgroundColor}`]: spacing.backgroundColor,
    [`_${FIELD_IDS.common.backgroundColor.replace('field_', '')}`]: FIELD_IDS.common.backgroundColor,
  };
}

/**
 * Build Blog Hero block
 */
function buildBlogHeroBlock(
  imageId: number | null,
  mobileImageId: number | null,
  date: string,
  author: string,
  categoryIds: number[],
  heroPostId: number | null
): string {
  const heroPostRefs = heroPostId ? [String(heroPostId)] : [];
  console.log('[wordpress] buildBlogHeroBlock refs', { heroPostId, heroPostRefs });
  // #region agent log
  fetch('http://127.0.0.1:7625/ingest/bc1ee6ac-1b9c-41ca-a38b-f4a0c8308643',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4e7e9a'},body:JSON.stringify({sessionId:'4e7e9a',runId:'hero-debug-1',hypothesisId:'H1',location:'src/lib/wordpress.ts:buildBlogHeroBlock',message:'Building hero block refs',data:{heroPostId,heroPostRefsLength:heroPostRefs.length,hasImage:Boolean(imageId),hasMobileImage:Boolean(mobileImageId),categoryCount:categoryIds.length},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  const data: Record<string, unknown> = {
    image: imageId || '',
    [`_image`]: FIELD_IDS.blogHero.image,
    [FIELD_IDS.blogHero.image]: imageId || '',
    mobile_image: mobileImageId || '',
    [`_mobile_image`]: FIELD_IDS.blogHero.mobileImage,
    [FIELD_IDS.blogHero.mobileImage]: mobileImageId || '',
    post: heroPostRefs,
    [`_post`]: FIELD_IDS.blogHero.post,
    [FIELD_IDS.blogHero.post]: heroPostRefs,
    date: date,
    [`_date`]: FIELD_IDS.blogHero.date,
    [FIELD_IDS.blogHero.date]: date,
    author: author,
    [`_author`]: FIELD_IDS.blogHero.author,
    [FIELD_IDS.blogHero.author]: author,
    category: categoryIds.map(String),
    [`_category`]: FIELD_IDS.blogHero.category,
    [FIELD_IDS.blogHero.category]: categoryIds.map(String),
    // Spacing
    custom_block_mobile_margin_top: HERO_SPACING.mobileMarginTop,
    [`_custom_block_mobile_margin_top`]: FIELD_IDS.common.mobileMarginTop,
    custom_block_desktop_margin_top: HERO_SPACING.desktopMarginTop,
    [`_custom_block_desktop_margin_top`]: FIELD_IDS.common.desktopMarginTop,
    custom_block_mobile_margin_bottom: HERO_SPACING.mobileMarginBottom,
    [`_custom_block_mobile_margin_bottom`]: FIELD_IDS.common.mobileMarginBottom,
    custom_block_desktop_margin_bottom: HERO_SPACING.desktopMarginBottom,
    [`_custom_block_desktop_margin_bottom`]: FIELD_IDS.common.desktopMarginBottom,
    custom_block_anchor: '',
    [`_custom_block_anchor`]: FIELD_IDS.common.anchor,
    padding_top_desktop: '0',
    [`_padding_top_desktop`]: FIELD_IDS.common.paddingTopDesktop,
    padding_top_mobile: '0',
    [`_padding_top_mobile`]: FIELD_IDS.common.paddingTopMobile,
    padding_bottom_desktop: '0',
    [`_padding_bottom_desktop`]: FIELD_IDS.common.paddingBottomDesktop,
    padding_bottom_mobile: '0',
    [`_padding_bottom_mobile`]: FIELD_IDS.common.paddingBottomMobile,
    background_color: '',
    [`_background_color`]: FIELD_IDS.common.backgroundColor,
  };

  return `<!-- wp:acf/blog-hero {"name":"acf/blog-hero","data":${JSON.stringify(data)},"mode":"edit"} /-->`;
}

/**
 * Inject the current WordPress post ID into the hero block's "post" reference.
 * Needed for newly created drafts where the post ID exists only after creation.
 */
function injectHeroPostReference(content: string, postId: number): string {
  const heroBlockRegex = /<!-- wp:acf\/blog-hero (\{[\s\S]*?\}) \/-->/;

  return content.replace(heroBlockRegex, (fullMatch, jsonPart: string) => {
    try {
      const parsed = JSON.parse(jsonPart) as { data?: Record<string, unknown> };
      if (!parsed.data) return fullMatch;

      const refs = [String(postId)];
      parsed.data.post = refs;
      parsed.data._post = FIELD_IDS.blogHero.post;
      parsed.data[FIELD_IDS.blogHero.post] = refs;
      console.log('[wordpress] injectHeroPostReference success', { postId, refs });
      // #region agent log
      fetch('http://127.0.0.1:7625/ingest/bc1ee6ac-1b9c-41ca-a38b-f4a0c8308643',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4e7e9a'},body:JSON.stringify({sessionId:'4e7e9a',runId:'hero-debug-1',hypothesisId:'H2',location:'src/lib/wordpress.ts:injectHeroPostReference',message:'Injected hero post reference',data:{postId,refsLength:refs.length,hasHeroBlock:true},timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      return `<!-- wp:acf/blog-hero ${JSON.stringify(parsed)} /-->`;
    } catch {
      // #region agent log
      fetch('http://127.0.0.1:7625/ingest/bc1ee6ac-1b9c-41ca-a38b-f4a0c8308643',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4e7e9a'},body:JSON.stringify({sessionId:'4e7e9a',runId:'hero-debug-1',hypothesisId:'H2',location:'src/lib/wordpress.ts:injectHeroPostReference',message:'Failed to parse hero block JSON',data:{postId},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return fullMatch;
    }
  });
}

/**
 * Build Intro Text block (for content sections)
 */
function buildIntroTextBlock(
  headline: string,
  content: string,
  offset: boolean = false,
  backgroundColor: string = ''
): string {
  const data: Record<string, unknown> = {
    [FIELD_IDS.introText.headline]: headline,
    [FIELD_IDS.introText.content]: content,
    [FIELD_IDS.introText.offset]: offset ? '1' : '0',
    [FIELD_IDS.common.mobileMarginTop]: DEFAULT_SPACING.mobileMarginTop,
    [FIELD_IDS.common.desktopMarginTop]: DEFAULT_SPACING.desktopMarginTop,
    [FIELD_IDS.common.mobileMarginBottom]: DEFAULT_SPACING.mobileMarginBottom,
    [FIELD_IDS.common.desktopMarginBottom]: DEFAULT_SPACING.desktopMarginBottom,
    [FIELD_IDS.common.anchor]: '',
    [FIELD_IDS.common.paddingTopDesktop]: '0',
    [FIELD_IDS.common.paddingTopMobile]: '0',
    [FIELD_IDS.common.paddingBottomDesktop]: '0',
    [FIELD_IDS.common.paddingBottomMobile]: '0',
    [FIELD_IDS.common.backgroundColor]: backgroundColor,
  };

  return `<!-- wp:acf/intro-text {"name":"acf/intro-text","data":${JSON.stringify(data)},"align":"left","mode":"edit"} /-->`;
}

/**
 * Build CTA block
 */
function buildCTABlock(
  headline: string,
  content: string,
  imageId: number | null = null
): string {
  const data: Record<string, unknown> = {
    [FIELD_IDS.cta.headline]: headline,
    [FIELD_IDS.cta.content]: content,
    [FIELD_IDS.cta.image]: imageId || '',
    [FIELD_IDS.common.mobileMarginTop]: DEFAULT_SPACING.mobileMarginTop,
    [FIELD_IDS.common.desktopMarginTop]: DEFAULT_SPACING.desktopMarginTop,
    [FIELD_IDS.common.mobileMarginBottom]: DEFAULT_SPACING.mobileMarginBottom,
    [FIELD_IDS.common.desktopMarginBottom]: DEFAULT_SPACING.desktopMarginBottom,
    [FIELD_IDS.common.anchor]: '',
    [FIELD_IDS.common.paddingTopDesktop]: '0',
    [FIELD_IDS.common.paddingTopMobile]: '0',
    [FIELD_IDS.common.paddingBottomDesktop]: '0',
    [FIELD_IDS.common.paddingBottomMobile]: '0',
    [FIELD_IDS.common.backgroundColor]: '',
  };

  return `<!-- wp:acf/cta {"name":"acf/cta","data":${JSON.stringify(data)},"mode":"edit"} /-->`;
}

/**
 * Build Recommended Content Module block
 */
function buildRecommendedContentBlock(
  headline: string,
  postIds: number[]
): string {
  const data: Record<string, unknown> = {
    headline: headline,
    [`_headline`]: FIELD_IDS.recommendedContent.headline,
    [FIELD_IDS.recommendedContent.headline]: headline,
    recommended_posts: postIds.map(String),
    [`_recommended_posts`]: FIELD_IDS.recommendedContent.recommendedPosts,
    [FIELD_IDS.recommendedContent.recommendedPosts]: postIds.map(String),
    custom_block_mobile_margin_top: DEFAULT_SPACING.mobileMarginTop,
    [`_custom_block_mobile_margin_top`]: FIELD_IDS.common.mobileMarginTop,
    custom_block_desktop_margin_top: DEFAULT_SPACING.desktopMarginTop,
    [`_custom_block_desktop_margin_top`]: FIELD_IDS.common.desktopMarginTop,
    custom_block_mobile_margin_bottom: DEFAULT_SPACING.mobileMarginBottom,
    [`_custom_block_mobile_margin_bottom`]: FIELD_IDS.common.mobileMarginBottom,
    custom_block_desktop_margin_bottom: DEFAULT_SPACING.desktopMarginBottom,
    [`_custom_block_desktop_margin_bottom`]: FIELD_IDS.common.desktopMarginBottom,
    custom_block_anchor: '',
    [`_custom_block_anchor`]: FIELD_IDS.common.anchor,
    padding_top_desktop: '0',
    [`_padding_top_desktop`]: FIELD_IDS.common.paddingTopDesktop,
    padding_top_mobile: '0',
    [`_padding_top_mobile`]: FIELD_IDS.common.paddingTopMobile,
    padding_bottom_desktop: '0',
    [`_padding_bottom_desktop`]: FIELD_IDS.common.paddingBottomDesktop,
    padding_bottom_mobile: '0',
    [`_padding_bottom_mobile`]: FIELD_IDS.common.paddingBottomMobile,
    background_color: '',
    [`_background_color`]: FIELD_IDS.common.backgroundColor,
  };

  return `<!-- wp:acf/recommended-content-module {"name":"acf/recommended-content-module","data":${JSON.stringify(data)},"mode":"edit"} /-->`;
}

// =============================================================================
// BUILD GUTENBERG CONTENT
// =============================================================================

/**
 * Build the complete Gutenberg block content from BlogPost
 */
async function buildGutenbergContent(
  post: BlogPost,
  heroPostId: number | null = null
): Promise<{
  content: string;
  headerImageId: number | null;
  mobileImageId: number | null;
  featuredImageId: number | null;
}> {
  const blocks: string[] = [];
  
  // 1. Upload header images
  let headerImageId: number | null = null;
  let mobileImageId: number | null = null;
  let featuredImageId: number | null = null;

  // Check if we have desktop header image (either as file or already uploaded)
  if (post.headerImageDesktop) {
    if (post.headerImageDesktop.wpMediaId) {
      console.log('[buildGutenbergContent] Using existing headerImageDesktop wpMediaId:', post.headerImageDesktop.wpMediaId);
      headerImageId = post.headerImageDesktop.wpMediaId;
    } else if (post.headerImageDesktop.file) {
      console.log('[buildGutenbergContent] Uploading new headerImageDesktop');
      headerImageId = await uploadMediaWithMeta(post.headerImageDesktop);
    }
  }

  // Check if we have mobile header image (either as file or already uploaded)
  if (post.headerImageMobile) {
    if (post.headerImageMobile.wpMediaId) {
      console.log('[buildGutenbergContent] Using existing headerImageMobile wpMediaId:', post.headerImageMobile.wpMediaId);
      mobileImageId = post.headerImageMobile.wpMediaId;
    } else if (post.headerImageMobile.file) {
      console.log('[buildGutenbergContent] Uploading new headerImageMobile');
      mobileImageId = await uploadMediaWithMeta(post.headerImageMobile);
    }
  }
  // #region agent log
  fetch('http://127.0.0.1:7625/ingest/bc1ee6ac-1b9c-41ca-a38b-f4a0c8308643',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4e7e9a'},body:JSON.stringify({sessionId:'4e7e9a',runId:'hero-debug-1',hypothesisId:'H3',location:'src/lib/wordpress.ts:buildGutenbergContent',message:'Resolved hero/featured media ids',data:{heroPostId,headerImageId,mobileImageId,featuredImageId,blockCount:post.blocks.length},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  // Featured image (use dedicated or header image)
  const postWithFeatured = post as BlogPost & {
    featuredImage?: ImageData;
    useFeaturedImageFromHeader?: boolean
  };

  if (postWithFeatured.featuredImage) {
    if (postWithFeatured.featuredImage.wpMediaId) {
      console.log('[buildGutenbergContent] Using existing featuredImage wpMediaId:', postWithFeatured.featuredImage.wpMediaId);
      featuredImageId = postWithFeatured.featuredImage.wpMediaId;
    } else if (postWithFeatured.featuredImage.file) {
      console.log('[buildGutenbergContent] Uploading new featuredImage');
      featuredImageId = await uploadMediaWithMeta(postWithFeatured.featuredImage);
    }
  } else if (postWithFeatured.useFeaturedImageFromHeader && headerImageId) {
    featuredImageId = headerImageId;
  }

  // 2. Get category IDs
  const categoryIds = await getCategoryIds(post.meta.categories);

  // 3. Build Blog Hero block
  const blogHeroBlock = buildBlogHeroBlock(
    headerImageId,
    mobileImageId,
    post.meta.date || '',
    post.meta.author || 'DNM',
    categoryIds,
    heroPostId
  );
  blocks.push(blogHeroBlock);

  // 4. Build Intro Text blocks for each content block
  for (let i = 0; i < post.blocks.length; i++) {
    const block = post.blocks[i];
    
    if (block.type === 'text') {
      // First block gets a light background
      const backgroundColor = i === 0 ? '#e6ecf2' : '';
      const introBlock = buildIntroTextBlock(
        block.headline || '',
        block.content || '',
        false,
        backgroundColor
      );
      blocks.push(introBlock);
    } else if (block.type === 'image' && block.image) {
      // For image blocks, use existing media ID or upload new image
      let imageId: number | null = null;

      if (block.image.wpMediaId) {
        console.log('[buildGutenbergContent] Using existing image block wpMediaId:', block.image.wpMediaId);
        imageId = block.image.wpMediaId;
      } else if (block.image.file) {
        console.log('[buildGutenbergContent] Uploading new image block');
        imageId = await uploadMediaWithMeta(block.image);
      }

      if (imageId) {
        const imageUrl = await getMediaUrl(imageId);
        const imageHtml = `<figure><img src="${imageUrl}" data-id="${imageId}" class="wp-image-${imageId}" />${block.image.caption ? `<figcaption>${block.image.caption}</figcaption>` : ''}</figure>`;
        const introBlock = buildIntroTextBlock('', imageHtml, false, '');
        blocks.push(introBlock);
      }
    }
  }

  // 5. Build Recommended Content block if there are related posts
  if (post.relatedPosts && post.relatedPosts.length > 0) {
    const recommendedBlock = buildRecommendedContentBlock(
      'Ähnliche Artikel',
      post.relatedPosts.map(p => p.id)
    );
    blocks.push(recommendedBlock);
  }

  return {
    content: blocks.join('\n\n'),
    headerImageId,
    mobileImageId,
    featuredImageId,
  };
}

// =============================================================================
// DRAFT STATE HELPERS
// =============================================================================

/**
 * Summary of a WordPress draft post
 */
export interface WPDraftSummary {
  id: number;
  title: string;
  modified: string;
  hasComposerState: boolean;
}

/**
 * Serialize post state for embedding (strips non-serializable File objects)
 */
function serializePostState(post: BlogPost): BlogPost {
  const stripFile = (img: ImageData): ImageData => ({ ...img, file: null });
  return {
    ...post,
    headerImageDesktop: stripFile(post.headerImageDesktop),
    headerImageMobile: stripFile(post.headerImageMobile),
    featuredImage: stripFile(post.featuredImage),
    blocks: post.blocks.map((block) => ({
      ...block,
      image: block.image ? stripFile(block.image) : undefined,
    })),
  };
}

/**
 * Embed the full composer state as a hidden HTML comment in the post content
 */
function embedStateInContent(post: BlogPost, content: string): string {
  const serialized = serializePostState(post);
  const encoded = Buffer.from(JSON.stringify(serialized)).toString('base64');
  return `<!-- dnm_composer_state: ${encoded} -->\n\n${content}`;
}

/**
 * Extract composer state from WP post content (raw)
 */
function extractStateFromContent(rawContent: string): BlogPost | null {
  const match = rawContent.match(/<!-- dnm_composer_state: ([A-Za-z0-9+/=\n]+) -->/);
  if (!match) return null;
  try {
    const decoded = Buffer.from(match[1].replace(/\n/g, ''), 'base64').toString('utf-8');
    return JSON.parse(decoded) as BlogPost;
  } catch {
    return null;
  }
}

/**
 * Restore image preview URLs from WordPress media (for cross-device loading)
 */
async function restoreImageUrl(img: ImageData): Promise<ImageData> {
  if (img.wpMediaId && (!img.preview || img.preview.startsWith('blob:'))) {
    try {
      const response = await axios.get(`${WP_REST_URL}/media/${img.wpMediaId}`, {
        headers: getAuthHeader(),
      });
      return { ...img, preview: response.data.source_url || '' };
    } catch (error) {
      console.error(`[restoreImageUrl] Failed to restore preview for media ${img.wpMediaId}:`, error);
      return img;
    }
  }
  return img;
}

/**
 * Fetch list of draft posts from WordPress
 */
export async function getDrafts(): Promise<WPDraftSummary[]> {
  try {
    const response = await axios.get(`${WP_REST_URL}/posts`, {
      headers: getAuthHeader(),
      params: {
        status: 'draft',
        context: 'edit',
        per_page: 50,
        orderby: 'modified',
        order: 'desc',
        _fields: 'id,title,modified,content',
      },
    });

    return response.data.map((p: { id: number; title: { rendered: string; raw: string }; modified: string; content: { raw: string } }) => ({
      id: p.id,
      title: p.title.rendered || p.title.raw || 'Kein Titel',
      modified: p.modified,
      hasComposerState: (p.content?.raw || '').includes('dnm_composer_state'),
    }));
  } catch (error) {
    throw handleWPError(error, 'Failed to fetch drafts');
  }
}

/**
 * Fetch a single draft with its full composer state restored
 */
export async function getDraftWithState(postId: number): Promise<BlogPost | null> {
  try {
    const response = await axios.get(`${WP_REST_URL}/posts/${postId}`, {
      headers: getAuthHeader(),
      params: { context: 'edit' },
    });

    const rawContent: string = response.data.content?.raw || '';
    const post = extractStateFromContent(rawContent);
    if (!post) return null;

    // Restore image preview URLs for cross-device compatibility
    const [headerImageDesktop, headerImageMobile, featuredImage] = await Promise.all([
      restoreImageUrl(post.headerImageDesktop),
      restoreImageUrl(post.headerImageMobile),
      restoreImageUrl(post.featuredImage),
    ]);

    const blocks = await Promise.all(
      post.blocks.map(async (block) => {
        if (block.image) {
          return { ...block, image: await restoreImageUrl(block.image) };
        }
        return block;
      })
    );

    return { ...post, headerImageDesktop, headerImageMobile, featuredImage, blocks };
  } catch (error) {
    throw handleWPError(error, 'Failed to fetch draft');
  }
}

// =============================================================================
// CREATE / UPDATE POSTS
// =============================================================================

/**
 * Create a draft post in WordPress
 */
export async function createDraft(post: BlogPost): Promise<{
  post: WPPost;
  mediaIds: {
    headerImageDesktop: number | null;
    headerImageMobile: number | null;
    featuredImage: number | null;
  };
}> {
  try {
    // 1. Build Gutenberg content (includes image uploads)
    const { content, headerImageId, mobileImageId, featuredImageId } = await buildGutenbergContent(post);

    // 2. Get category and tag IDs
    const categoryIds = await getCategoryIds(post.meta.categories);
    const tagIds = await getOrCreateTagIds(post.meta.tags);

    // 3. Prepare post data
    const postData: Record<string, unknown> = {
      title: post.title,
      content: embedStateInContent(post, content),
      excerpt: post.excerpt || '',
      status: 'draft',
      slug: post.seo.slug || undefined,
      categories: categoryIds,
      tags: tagIds,
    };

    // 4. Add featured image if available
    if (featuredImageId) {
      postData.featured_media = featuredImageId;
    }

    // 5. Add Yoast SEO meta (if Yoast REST API is enabled)
    if (post.seo.title || post.seo.description || post.seo.focusKeyword) {
      postData.meta = {
        _yoast_wpseo_title: post.seo.title || '',
        _yoast_wpseo_metadesc: post.seo.description || '',
        _yoast_wpseo_focuskw: post.seo.focusKeyword || '',
      };
    }

    // 6. Create the post
    const response = await axios.post(`${WP_REST_URL}/posts`, postData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    console.log('[wordpress] createDraft created post', { postId: response.data?.id ?? null });
    // #region agent log
    fetch('http://127.0.0.1:7625/ingest/bc1ee6ac-1b9c-41ca-a38b-f4a0c8308643',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4e7e9a'},body:JSON.stringify({sessionId:'4e7e9a',runId:'hero-debug-1',hypothesisId:'H1',location:'src/lib/wordpress.ts:createDraft',message:'Created draft on WordPress',data:{createdPostId:response.data?.id ?? null,hasContent:Boolean(content)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    // New drafts don't know their post ID at content build time.
    // Patch hero block after creation so headline/image logic can resolve correctly in theme preview.
    if (response.data?.id) {
      const contentWithHeroRef = injectHeroPostReference(content, response.data.id);
      if (contentWithHeroRef !== content) {
        console.log('[wordpress] createDraft patching hero reference', { postId: response.data.id });
        await axios.put(
          `${WP_REST_URL}/posts/${response.data.id}`,
          { content: embedStateInContent(post, contentWithHeroRef) },
          {
            headers: {
              ...getAuthHeader(),
              'Content-Type': 'application/json',
            },
          }
        );
        // #region agent log
        fetch('http://127.0.0.1:7625/ingest/bc1ee6ac-1b9c-41ca-a38b-f4a0c8308643',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4e7e9a'},body:JSON.stringify({sessionId:'4e7e9a',runId:'hero-debug-1',hypothesisId:'H4',location:'src/lib/wordpress.ts:createDraft',message:'Patched draft content with hero post reference',data:{postId:response.data.id,contentChanged:true},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
      } else {
        console.log('[wordpress] createDraft hero patch skipped (content unchanged)', { postId: response.data.id });
        // #region agent log
        fetch('http://127.0.0.1:7625/ingest/bc1ee6ac-1b9c-41ca-a38b-f4a0c8308643',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4e7e9a'},body:JSON.stringify({sessionId:'4e7e9a',runId:'hero-debug-1',hypothesisId:'H2',location:'src/lib/wordpress.ts:createDraft',message:'Hero reference patch skipped because content unchanged',data:{postId:response.data.id},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
      }
    }

    return {
      post: response.data,
      mediaIds: {
        headerImageDesktop: headerImageId,
        headerImageMobile: mobileImageId,
        featuredImage: featuredImageId,
      },
    };
  } catch (error) {
    throw handleWPError(error, 'Failed to create draft');
  }
}

/**
 * Update an existing draft post in WordPress
 */
export async function updateDraft(postId: number, post: BlogPost): Promise<{
  post: WPPost;
  mediaIds: {
    headerImageDesktop: number | null;
    headerImageMobile: number | null;
    featuredImage: number | null;
  };
}> {
  try {
    // 1. Build Gutenberg content (includes image uploads)
    const { content, headerImageId, mobileImageId, featuredImageId } = await buildGutenbergContent(post, postId);
    console.log('[wordpress] updateDraft building content', { postId, headerImageId, mobileImageId, featuredImageId });
    // #region agent log
    fetch('http://127.0.0.1:7625/ingest/bc1ee6ac-1b9c-41ca-a38b-f4a0c8308643',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4e7e9a'},body:JSON.stringify({sessionId:'4e7e9a',runId:'hero-debug-1',hypothesisId:'H5',location:'src/lib/wordpress.ts:updateDraft',message:'Updating draft with explicit hero post id',data:{postId,hasContent:Boolean(content),headerImageId,mobileImageId},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    // 2. Get category and tag IDs
    const categoryIds = await getCategoryIds(post.meta.categories);
    const tagIds = await getOrCreateTagIds(post.meta.tags);

    // 3. Prepare post data
    const postData: Record<string, unknown> = {
      title: post.title,
      content: embedStateInContent(post, content),
      excerpt: post.excerpt || '',
      slug: post.seo.slug || undefined,
      categories: categoryIds,
      tags: tagIds,
    };

    // 4. Add featured image if available
    if (featuredImageId) {
      postData.featured_media = featuredImageId;
    }

    // 5. Add Yoast SEO meta
    if (post.seo.title || post.seo.description || post.seo.focusKeyword) {
      postData.meta = {
        _yoast_wpseo_title: post.seo.title || '',
        _yoast_wpseo_metadesc: post.seo.description || '',
        _yoast_wpseo_focuskw: post.seo.focusKeyword || '',
      };
    }

    // 6. Update the post
    const response = await axios.put(`${WP_REST_URL}/posts/${postId}`, postData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    return {
      post: response.data,
      mediaIds: {
        headerImageDesktop: headerImageId,
        headerImageMobile: mobileImageId,
        featuredImage: featuredImageId,
      },
    };
  } catch (error) {
    throw handleWPError(error, 'Failed to update draft');
  }
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

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

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

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

/**
 * Test authentication
 */
export async function testAuth(): Promise<boolean> {
  try {
    const response = await axios.get(`${WP_REST_URL}/users/me`, {
      headers: getAuthHeader(),
    });
    return response.status === 200;
  } catch (error) {
    console.error('WordPress auth test failed:', error);
    return false;
  }
}
