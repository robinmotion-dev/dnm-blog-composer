'use client';

import { useEffect } from 'react';
import slugify from 'slugify';
import { useEditorStore } from '@/stores/editor-store';
import Input from '@/components/UI/Input';
import Textarea from '@/components/UI/Textarea';
import Label from '@/components/UI/Label';
import Card from '@/components/UI/Card';

const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;

export default function SEOPanel() {
  const seo = useEditorStore((state) => state.post.seo);
  const title = useEditorStore((state) => state.post.title);
  const setSEO = useEditorStore((state) => state.setSEO);

  // Auto-generate slug from title if slug is empty
  useEffect(() => {
    if (title && !seo.slug) {
      const generatedSlug = slugify(title, {
        lower: true,
        strict: true,
        locale: 'de',
      });
      setSEO({ slug: generatedSlug });
    }
  }, [title, seo.slug, setSEO]);

  const titleRemaining = MAX_TITLE_LENGTH - seo.title.length;
  const descRemaining = MAX_DESCRIPTION_LENGTH - seo.description.length;

  const isTitleOverLimit = titleRemaining < 0;
  const isDescOverLimit = descRemaining < 0;

  return (
    <Card variant="bordered" className="p-4 mb-6">
      <h3 className="text-sm font-semibold text-neutral-700 mb-4">
        SEO Einstellungen
      </h3>

      <div className="space-y-4">
        {/* SEO Title */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="seo-title">SEO Titel</Label>
            <span
              className={`text-sm ${
                isTitleOverLimit
                  ? 'text-red-600 font-semibold'
                  : titleRemaining < 10
                  ? 'text-yellow-600'
                  : 'text-neutral-500'
              }`}
            >
              {titleRemaining} Zeichen übrig
            </span>
          </div>
          <Input
            id="seo-title"
            type="text"
            value={seo.title}
            onChange={(e) => setSEO({ title: e.target.value })}
            placeholder="Optimierter Titel für Suchmaschinen"
            fullWidth
            error={isTitleOverLimit}
          />
          <p className="text-xs text-neutral-500 mt-1">
            Optimal: 50-60 Zeichen
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="seo-description">Meta Description</Label>
            <span
              className={`text-sm ${
                isDescOverLimit
                  ? 'text-red-600 font-semibold'
                  : descRemaining < 20
                  ? 'text-yellow-600'
                  : 'text-neutral-500'
              }`}
            >
              {descRemaining} Zeichen übrig
            </span>
          </div>
          <Textarea
            id="seo-description"
            value={seo.description}
            onChange={(e) => setSEO({ description: e.target.value })}
            placeholder="Kurze Beschreibung für Suchergebnisse"
            rows={3}
            fullWidth
            error={isDescOverLimit}
          />
          <p className="text-xs text-neutral-500 mt-1">
            Optimal: 120-160 Zeichen
          </p>
        </div>

        {/* Focus Keyword */}
        <div>
          <Label htmlFor="seo-keyword">Focus Keyword</Label>
          <Input
            id="seo-keyword"
            type="text"
            value={seo.focusKeyword}
            onChange={(e) => setSEO({ focusKeyword: e.target.value })}
            placeholder="Haupt-Suchbegriff für diesen Artikel"
            fullWidth
          />
          <p className="text-xs text-neutral-500 mt-1">
            Das wichtigste Keyword für diesen Artikel
          </p>
        </div>

        {/* URL Slug */}
        <div>
          <Label htmlFor="seo-slug">URL Slug</Label>
          <Input
            id="seo-slug"
            type="text"
            value={seo.slug}
            onChange={(e) => setSEO({ slug: e.target.value })}
            placeholder="artikel-url-slug"
            fullWidth
          />
          <p className="text-xs text-neutral-500 mt-1">
            URL: dnm.berlin/blog/{seo.slug || 'artikel-url-slug'}
          </p>
        </div>
      </div>
    </Card>
  );
}
