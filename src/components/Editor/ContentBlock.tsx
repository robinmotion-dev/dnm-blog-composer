'use client';

import { GripVertical, Trash2 } from 'lucide-react';
import { ContentBlock as ContentBlockType, ImageData } from '@/types';
import Input from '@/components/UI/Input';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import Button from '@/components/UI/Button';
import Card from '@/components/UI/Card';

interface ContentBlockProps {
  block: ContentBlockType;
  onUpdate: (data: Partial<ContentBlockType>) => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

export default function ContentBlock({
  block,
  onUpdate,
  onDelete,
  dragHandleProps,
}: ContentBlockProps) {
  const emptyImage: ImageData = {
    file: null,
    preview: '',
    alt: '',
    caption: '',
    description: '',
  };

  return (
    <Card variant="bordered" className="p-4 mb-4">
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing pt-2"
        >
          <GripVertical className="h-5 w-5 text-neutral-400" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {block.type === 'text' ? (
            <>
              {/* Text Block: Headline */}
              <div>
                <Input
                  type="text"
                  value={block.headline || ''}
                  onChange={(e) => onUpdate({ headline: e.target.value })}
                  placeholder="Vertical Headline"
                  fullWidth
                  className="font-semibold"
                />
              </div>

              {/* Text Block: Rich Text Editor */}
              <RichTextEditor
                value={block.content || ''}
                onChange={(html) => onUpdate({ content: html })}
              />
            </>
          ) : (
            <>
              {/* Image Block */}
              <div className="bg-emerald-50 border border-emerald-200 rounded px-3 py-2 mb-2">
                <span className="text-sm font-medium text-emerald-800">
                  Bildblock
                </span>
              </div>
              <ImageUploader
                label=""
                image={block.image || emptyImage}
                onChange={(image) => onUpdate({ image })}
              />
            </>
          )}
        </div>

        {/* Delete Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
