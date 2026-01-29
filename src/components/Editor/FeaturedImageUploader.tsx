'use client';

import { useEditorStore } from '@/stores/editor-store';
import ImageUploader from './ImageUploader';
import Label from '@/components/UI/Label';
import Card from '@/components/UI/Card';

const emptyImage = {
  file: null,
  preview: '',
  alt: '',
  caption: '',
  description: '',
};

export default function FeaturedImageUploader() {
  const featuredImage = useEditorStore((state) => state.post.featuredImage || emptyImage);
  const headerImageDesktop = useEditorStore(
    (state) => state.post.headerImageDesktop
  );
  const useFeaturedImageFromHeader = useEditorStore(
    (state) => state.post.useFeaturedImageFromHeader ?? false
  );
  const setFeaturedImage = useEditorStore((state) => state.setFeaturedImage);
  const setUseFeaturedImageFromHeader = useEditorStore(
    (state) => state.setUseFeaturedImageFromHeader
  );

  return (
    <Card variant="bordered" className="p-4 mb-6">
      <h3 className="text-sm font-semibold text-neutral-700 mb-4">
        Beitragsbild / Featured Image (Teaserbild)
      </h3>

      {/* Checkbox: Use Header Image */}
      <div className="mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={useFeaturedImageFromHeader}
            onChange={(e) => setUseFeaturedImageFromHeader(e.target.checked)}
            className="mr-2 h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-neutral-700">
            Header-Bild (Desktop) als Teaserbild verwenden
          </span>
        </label>
      </div>

      {useFeaturedImageFromHeader ? (
        <div className="space-y-3">
          {/* Info Box */}
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
            <p className="text-sm text-emerald-800">
              <strong>Info:</strong> Das Desktop Header-Bild wird automatisch
              als Teaserbild verwendet. Es wird von links und rechts gleichmäßig
              auf ein Quadrat gecroppt.
            </p>
          </div>

          {/* Preview of Header Image */}
          {headerImageDesktop.preview ? (
            <div>
              <Label>Vorschau (wird gecroppt)</Label>
              <div className="relative rounded-lg overflow-hidden border border-neutral-300">
                <img
                  src={headerImageDesktop.preview}
                  alt={headerImageDesktop.alt || 'Header Desktop Preview'}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1/2 h-full border-2 border-dashed border-emerald-500 bg-emerald-500 bg-opacity-10">
                    <div className="flex items-center justify-center h-full">
                      <span className="text-emerald-700 font-semibold bg-white bg-opacity-90 px-3 py-1 rounded">
                        Crop-Bereich (Quadrat)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Der markierte Bereich wird als Teaserbild verwendet
              </p>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center text-neutral-500">
              <p>Noch kein Desktop Header-Bild hochgeladen</p>
              <p className="text-sm mt-1">
                Lade zuerst ein Desktop Header-Bild hoch
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <ImageUploader
            label=""
            image={featuredImage}
            onChange={setFeaturedImage}
          />
          <p className="text-xs text-neutral-500 mt-2">
            Dieses Bild wird in der Artikelübersicht als Teaser angezeigt
          </p>
        </div>
      )}
    </Card>
  );
}
