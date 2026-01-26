'use client';

import { useEditorStore } from '@/stores/editor-store';
import TitleInput from '@/components/Editor/TitleInput';
import ImageUploader from '@/components/Editor/ImageUploader';
import ExcerptInput from '@/components/Editor/ExcerptInput';
import BlockList from '@/components/Editor/BlockList';
import MetaFields from '@/components/Editor/MetaFields';

export default function Home() {
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

  return (
    <main className="h-dvh flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="font-semibold">DNM Blog Composer</div>

        <div className="text-sm text-neutral-500">
          {/* Placeholder – Status kommt später aus Store */}
          Autosave: —
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

          <MetaFields />
        </section>

        {/* Preview */}
        <section className="overflow-auto p-6 bg-neutral-50">
          <div className="text-sm text-neutral-500 mb-3">Preview (kommt in TASK-014)</div>
          <div className="rounded-lg border bg-white p-6">
            <p className="text-neutral-600">
              Platzhalter: Hier kommt die Live-Preview rein.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}