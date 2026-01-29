'use client';

import { useState, useEffect } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import Input from '@/components/UI/Input';
import Label from '@/components/UI/Label';
import Button from '@/components/UI/Button';
import Skeleton from '@/components/UI/Skeleton';
import { Search, X } from 'lucide-react';

interface WPPost {
  id: number;
  title: {
    rendered: string;
  };
  slug: string;
}

export default function RelatedPosts() {
  const relatedPosts = useEditorStore((state) => state.post.relatedPosts);
  const setRelatedPosts = useEditorStore((state) => state.setRelatedPosts);

  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from WordPress
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = searchTerm
          ? `/api/posts?search=${encodeURIComponent(searchTerm)}`
          : '/api/posts';

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Check if post is already selected
  const isSelected = (postId: number) => {
    return relatedPosts.some((p) => p.id === postId);
  };

  // Add post to related posts
  const addPost = (post: WPPost) => {
    if (relatedPosts.length >= 3) {
      return; // Max 3 posts
    }

    if (!isSelected(post.id)) {
      setRelatedPosts([
        ...relatedPosts,
        {
          id: post.id,
          title: post.title.rendered,
          slug: post.slug,
        },
      ]);
    }
  };

  // Remove post from related posts
  const removePost = (postId: number) => {
    setRelatedPosts(relatedPosts.filter((p) => p.id !== postId));
  };

  return (
    <div className="space-y-4">
      <Label>Ähnliche Artikel (max. 3)</Label>

      {/* Selected Posts */}
      {relatedPosts.length > 0 && (
        <div className="space-y-2 mb-4">
          {relatedPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded px-3 py-2"
            >
              <span className="text-sm font-medium text-emerald-900">
                {post.title}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePost(post.id)}
              >
                <X className="h-4 w-4 text-emerald-700" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Search Field */}
      {relatedPosts.length < 3 && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Suche nach Artikeln..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="border border-neutral-300 rounded-lg p-3 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} height="2rem" />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-sm text-red-600 text-center py-2">{error}</div>
          )}

          {/* Post List */}
          {!loading && !error && posts.length > 0 && (
            <div className="border border-neutral-300 rounded-lg max-h-64 overflow-y-auto">
              {posts
                .filter((post) => !isSelected(post.id))
                .map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => addPost(post)}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-50 border-b border-neutral-200 last:border-b-0 text-sm transition-colors"
                  >
                    {post.title.rendered}
                  </button>
                ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && posts.length === 0 && searchTerm && (
            <div className="text-sm text-neutral-500 text-center py-4">
              Keine Artikel gefunden
            </div>
          )}
        </>
      )}

      {/* Max Limit Info */}
      {relatedPosts.length >= 3 && (
        <div className="text-sm text-neutral-600 text-center py-2 bg-neutral-50 rounded border border-neutral-200">
          Maximale Anzahl ähnlicher Artikel erreicht (3)
        </div>
      )}
    </div>
  );
}
