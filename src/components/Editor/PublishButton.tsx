'use client';

import { useState } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import Button from '@/components/UI/Button';
import { Upload, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PublishButton() {
  const post = useEditorStore((state) => state.post);
  const setWpPostId = useEditorStore((state) => state.setWpPostId);
  const setImageMediaId = useEditorStore((state) => state.setImageMediaId);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastPublishedLink, setLastPublishedLink] = useState<string | null>(
    null
  );

  const isUpdate = !!post.wpPostId;

  const handlePublish = async () => {
    // Validation
    if (!post.title || post.title.trim() === '') {
      toast.error('Bitte gib einen Titel ein');
      return;
    }

    if (post.blocks.length === 0) {
      toast.error('Bitte füge mindestens einen Content Block hinzu');
      return;
    }

    setIsPublishing(true);
    setLastPublishedLink(null);

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish post');
      }

      // Success
      const wpPost = data.post;
      setLastPublishedLink(wpPost.link);

      // Save WordPress Post ID for future updates
      if (wpPost.id && !post.wpPostId) {
        setWpPostId(wpPost.id);
      }

      // Save Media IDs for future updates (to avoid re-uploading)
      if (data.mediaIds) {
        if (data.mediaIds.headerImageDesktop) {
          setImageMediaId('headerImageDesktop', data.mediaIds.headerImageDesktop);
        }
        if (data.mediaIds.headerImageMobile) {
          setImageMediaId('headerImageMobile', data.mediaIds.headerImageMobile);
        }
        if (data.mediaIds.featuredImage) {
          setImageMediaId('featuredImage', data.mediaIds.featuredImage);
        }

        // Force persist immediately by triggering a small state change
        setTimeout(() => {
          console.log('Media IDs saved:', data.mediaIds);
        }, 100);
      }

      const successMessage = isUpdate
        ? 'Draft erfolgreich aktualisiert!'
        : 'Draft erfolgreich erstellt!';

      toast.success(
        (t) => (
          <div className="flex items-center gap-2">
            <span>{successMessage}</span>
            {wpPost.link && (
              <a
                href={wpPost.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-800 underline flex items-center gap-1"
                onClick={() => toast.dismiss(t.id)}
              >
                Öffnen
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ),
        {
          duration: 6000,
        }
      );
    } catch (error) {
      console.error('Publish error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Fehler beim Veröffentlichen. Bitte versuche es erneut.'
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={handlePublish}
        loading={isPublishing}
        fullWidth
        className="relative"
      >
        <Upload className="h-5 w-5 mr-2" />
        {isPublishing
          ? isUpdate
            ? 'Wird aktualisiert...'
            : 'Wird veröffentlicht...'
          : isUpdate
          ? 'Draft in WordPress aktualisieren'
          : 'Als Draft in WordPress veröffentlichen'}
      </Button>

      {lastPublishedLink && !isPublishing && (
        <div className="text-sm bg-green-50 border border-green-200 rounded px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-green-800">
              {isUpdate ? 'Draft aktualisiert:' : 'Draft erstellt:'}
            </span>
            <a
              href={lastPublishedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-800 underline flex items-center gap-1"
            >
              Im WordPress öffnen
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
