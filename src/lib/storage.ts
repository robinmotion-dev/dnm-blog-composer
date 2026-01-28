// src/lib/storage.ts

const STORAGE_KEY = 'dnm-blog-editor-storage';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

/**
 * Check if a draft exists in localStorage
 */
export function hasDraft(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored !== null;
}

/**
 * Get the last saved timestamp from localStorage
 */
export function getLastSavedDate(): Date | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);
    return data.state?.lastSaved ? new Date(data.state.lastSaved) : null;
  } catch (error) {
    console.error('Error reading last saved date:', error);
    return null;
  }
}

/**
 * Clear the draft from localStorage
 */
export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Setup autosave interval
 * @param saveFn - Function to call on autosave
 * @returns Cleanup function to stop autosave
 */
export function setupAutosave(saveFn: () => void): () => void {
  const intervalId = setInterval(() => {
    saveFn();
  }, AUTOSAVE_INTERVAL);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
}

/**
 * Check if the post has any content
 */
export function hasContent(post: any): boolean {
  return !!(
    post.title ||
    post.excerpt ||
    post.blocks.length > 0 ||
    post.headerImageDesktop.preview ||
    post.headerImageMobile.preview ||
    post.featuredImage.preview
  );
}
