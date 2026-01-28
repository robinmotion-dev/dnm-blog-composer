'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useEditorStore } from '@/stores/editor-store';
import { setupAutosave, hasDraft, getLastSavedDate } from '@/lib/storage';
import TitleInput from '@/components/Editor/TitleInput';
import ImageUploader from '@/components/Editor/ImageUploader';
import ExcerptInput from '@/components/Editor/ExcerptInput';
import BlockList from '@/components/Editor/BlockList';
import FeaturedImageUploader from '@/components/Editor/FeaturedImageUploader';
import MetaFields from '@/components/Editor/MetaFields';
import RelatedPosts from '@/components/Editor/RelatedPosts';
import SEOPanel from '@/components/SEO/SEOPanel';
import SEOIndicator from '@/components/SEO/SEOIndicator';
import PublishButton from '@/components/Editor/PublishButton';
import BlogPreview from '@/components/Preview/BlogPreview';
import Button from '@/components/UI/Button';

export default function Home() {
  const [showDraftNotice, setShowDraftNotice] = useState(false);

  const headerImageDesktop = useEditorStore(
    (state) => state.post.headerImageDesktop
  );
  const headerImageMobile = useEditorStore(
    (state) => state.post.headerImageMobile
  );
  const setHeaderImageDesktop = useEditorStore(
    (state) => state.setHeaderImageDesktop
  );
  const setHeaderImageMobile = useEditorStore(
    (state) => state.setHeaderImageMobile
  );
  const lastSaved = useEditorStore((state) => state.lastSaved);
  const isDirty = useEditorStore((state) => state.isDirty);
  const autosave = useEditorStore((state) => state.autosave);
  const clearDraft = useEditorStore((state) => state.clearDraft);

  // Check for existing draft on mount
  useEffect(() => {
    if (hasDraft()) {
      const lastSavedDate = getLastSavedDate();
      if (lastSavedDate) {
        setShowDraftNotice(true);
        toast.success(
          `Entwurf wiederhergestellt (zuletzt gespeichert: ${lastSavedDate.toLocaleString('de-DE')})`
        );
      }
    }
  }, []);

  // Setup autosave
  useEffect(() => {
    const cleanup = setupAutosave(() => {
      autosave();
    });

    return cleanup;
  }, [autosave]);

  const handleClearDraft = () => {
    if (
      confirm(
        'Möchtest du den Entwurf wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.'
      )
    ) {
      clearDraft();
      setShowDraftNotice(false);
      toast.success('Entwurf gelöscht');
    }
  };

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return '—';
    const date = new Date(lastSaved);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="h-dvh flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="font-semibold">DNM Blog Composer</div>
          {showDraftNotice && (
            <Button variant="ghost" size="sm" onClick={handleClearDraft}>
              Entwurf löschen
            </Button>
          )}
        </div>

        <div className="text-sm text-neutral-500">
          Autosave: {formatLastSaved()}
          {isDirty && ' (nicht gespeichert)'}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Editor */}
        <section className="border-b lg:border-b-0 lg:border-r overflow-auto p-6">
          <TitleInput />

          <ImageUploader
            label="Header Bild Desktop"
            image={headerImageDesktop}
            onChange={setHeaderImageDesktop}
          />

          <ImageUploader
            label="Header Bild Mobile"
            image={headerImageMobile}
            onChange={setHeaderImageMobile}
          />

          <ExcerptInput />

          <BlockList />

          <FeaturedImageUploader />

          <MetaFields />

          <RelatedPosts />

          <SEOPanel />

          <SEOIndicator />

          <PublishButton />
        </section>

        {/* Preview */}
        <section className="overflow-auto p-6 bg-neutral-50">
          <BlogPreview />
        </section>
      </div>
    </main>
  );
}