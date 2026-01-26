'use client';

import { useEditorStore } from '@/stores/editor-store';
import Textarea from '@/components/UI/Textarea';
import Label from '@/components/UI/Label';

const MAX_LENGTH = 300;

export default function ExcerptInput() {
  const excerpt = useEditorStore((state) => state.post.excerpt);
  const setExcerpt = useEditorStore((state) => state.setExcerpt);

  const remaining = MAX_LENGTH - excerpt.length;
  const isOverLimit = remaining < 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor="excerpt">Teaser / Excerpt</Label>
        <span
          className={`text-sm ${
            isOverLimit
              ? 'text-red-600 font-semibold'
              : remaining < 50
              ? 'text-yellow-600'
              : 'text-neutral-500'
          }`}
        >
          {remaining} Zeichen übrig
        </span>
      </div>
      <Textarea
        id="excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Kurze Zusammenfassung des Artikels (max. 300 Zeichen)"
        rows={4}
        fullWidth
        error={isOverLimit}
      />
      {isOverLimit && (
        <p className="text-sm text-red-600 mt-1">
          Der Teaser ist zu lang. Bitte kürze ihn um {Math.abs(remaining)}{' '}
          Zeichen.
        </p>
      )}
    </div>
  );
}
