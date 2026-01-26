'use client';

import { useEditorStore } from '@/stores/editor-store';
import Input from '@/components/UI/Input';

export default function TitleInput() {
  const title = useEditorStore((state) => state.post.title);
  const setTitle = useEditorStore((state) => state.setTitle);

  return (
    <div className="mb-6">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Artikel-Titel eingeben..."
        fullWidth
        className="text-2xl font-bold py-3"
      />
    </div>
  );
}
