'use client';

import { useEditorStore } from '@/stores/editor-store';
import Input from '@/components/UI/Input';
import Label from '@/components/UI/Label';
import Card from '@/components/UI/Card';

// Hardcoded categories for now (can be loaded from WP later)
const CATEGORIES = [
  'Technologie',
  'Design',
  'Marketing',
  'Business',
  'Entwicklung',
];

export default function MetaFields() {
  const meta = useEditorStore((state) => state.post.meta);
  const setMeta = useEditorStore((state) => state.setMeta);

  const handleCategoryToggle = (category: string) => {
    const currentCategories = meta.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];
    setMeta({ categories: newCategories });
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setMeta({ tags });
  };

  return (
    <Card variant="bordered" className="p-4 mb-6">
      <h3 className="text-sm font-semibold text-neutral-700 mb-4">
        Meta-Informationen
      </h3>

      <div className="space-y-4">
        {/* Date Picker */}
        <div>
          <Label htmlFor="meta-date" required>
            Veröffentlichungsdatum
          </Label>
          <Input
            id="meta-date"
            type="date"
            value={meta.date.split('T')[0]}
            onChange={(e) =>
              setMeta({ date: new Date(e.target.value).toISOString() })
            }
            fullWidth
          />
        </div>

        {/* Author */}
        <div>
          <Label htmlFor="meta-author" required>
            Autor
          </Label>
          <Input
            id="meta-author"
            type="text"
            value={meta.author}
            onChange={(e) => setMeta({ author: e.target.value })}
            placeholder="Name des Autors"
            fullWidth
          />
        </div>

        {/* Categories */}
        <div>
          <Label>Kategorien</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {CATEGORIES.map((category) => (
              <label
                key={category}
                className="inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={meta.categories?.includes(category) || false}
                  onChange={() => handleCategoryToggle(category)}
                  className="mr-2 h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-neutral-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="meta-tags">Tags (Komma-getrennt)</Label>
          <Input
            id="meta-tags"
            type="text"
            value={meta.tags?.join(', ') || ''}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="react, typescript, web development"
            fullWidth
          />
          <p className="text-xs text-neutral-500 mt-1">
            Mehrere Tags mit Komma trennen
          </p>
        </div>
      </div>
    </Card>
  );
}
