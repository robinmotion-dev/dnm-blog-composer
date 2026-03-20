'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import LoadDraftModal from '@/components/Editor/LoadDraftModal';

export default function Home() {
  const [showDraftNotice, setShowDraftNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [showLoadDraftModal, setShowLoadDraftModal] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
  };

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
    <main className="h-dvh flex flex-col bg-neutral-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="font-semibold text-neutral-900">
            DNM Blog Composer
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowLoadDraftModal(true)}>
            Entwurf laden
          </Button>
          {showDraftNotice && (
            <Button variant="ghost" size="sm" onClick={handleClearDraft}>
              Entwurf löschen
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-neutral-500">
            Autosave: {formatLastSaved()}
            {isDirty && ' (nicht gespeichert)'}
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Abmelden
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Mobile Tabs */}
        <div className="lg:hidden col-span-full border-b border-neutral-200 bg-white px-4 py-2 sticky top-0 z-10">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'editor'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 text-neutral-700'
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 text-neutral-700'
              }`}
            >
              Vorschau
            </button>
          </div>
        </div>

        {/* Editor */}
        <section
          className={`border-b lg:border-b-0 lg:border-r border-neutral-200 overflow-auto p-5 md:p-6 lg:p-8 bg-white ${
            activeTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
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
        <section
          className={`overflow-auto p-5 md:p-6 lg:p-8 bg-neutral-50 ${
            activeTab === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          <BlogPreview />
        </section>
      </div>

      {showLoadDraftModal && (
        <LoadDraftModal onClose={() => setShowLoadDraftModal(false)} />
      )}
    </main>
  );
}
