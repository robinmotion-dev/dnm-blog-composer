'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { ImageData } from '@/types';
import Input from '@/components/UI/Input';
import Textarea from '@/components/UI/Textarea';
import Label from '@/components/UI/Label';
import Button from '@/components/UI/Button';

interface ImageUploaderProps {
  label: string;
  image: ImageData;
  onChange: (image: ImageData) => void;
}

export default function ImageUploader({
  label,
  image,
  onChange,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const latestImageRef = useRef<ImageData>(image);

  useEffect(() => {
    latestImageRef.current = image;
  }, [image]);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', latestImageRef.current.alt || '');
      formData.append('caption', latestImageRef.current.caption || '');
      formData.append('description', latestImageRef.current.description || '');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      if (data.mediaId) {
        onChange({
          ...latestImageRef.current,
          wpMediaId: data.mediaId,
        });
      }
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Upload failed'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const updateMeta = async (nextImage: ImageData) => {
    if (!nextImage.wpMediaId) return;

    try {
      const formData = new FormData();
      formData.append('mediaId', String(nextImage.wpMediaId));
      formData.append('alt', nextImage.alt || '');
      formData.append('caption', nextImage.caption || '');
      formData.append('description', nextImage.description || '');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Meta update failed');
      }
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Meta update failed'
      );
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Bitte wähle eine Bilddatei aus.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({
        ...image,
        file,
        preview: e.target?.result as string,
      });
      uploadFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    onChange({
      file: null,
      preview: '',
      alt: '',
      caption: '',
      description: '',
      wpMediaId: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-6">
      <Label className="mb-2">{label}</Label>

      {!image.preview ? (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-neutral-300 hover:border-neutral-400'
          }`}
        >
          <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-3" />
          <p className="text-neutral-600 mb-1">
            Klicke hier oder ziehe ein Bild hierher
          </p>
          <p className="text-sm text-neutral-500">PNG, JPG, GIF bis 10MB</p>
          {isUploading && (
            <p className="text-sm text-blue-600 mt-2">Upload l„uft...</p>
          )}
          {uploadError && (
            <p className="text-sm text-red-600 mt-2">{uploadError}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border border-neutral-300">
            <img
              src={image.preview}
              alt={image.alt || 'Preview'}
              className="w-full h-auto"
            />
            <Button
              variant="danger"
              size="sm"
              onClick={handleRemove}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {isUploading && (
            <p className="text-sm text-blue-600">Upload l„uft...</p>
          )}
          {uploadError && (
            <p className="text-sm text-red-600">{uploadError}</p>
          )}

          <div>
            <Label htmlFor={`${label}-alt`}>Alt-Text</Label>
            <Input
              id={`${label}-alt`}
              type="text"
              value={image.alt}
              onChange={(e) => onChange({ ...image, alt: e.target.value })}
              onBlur={() => updateMeta(latestImageRef.current)}
              placeholder="Beschreibung für Screenreader"
              fullWidth
            />
          </div>

          <div>
            <Label htmlFor={`${label}-caption`}>Bildunterschrift</Label>
            <Input
              id={`${label}-caption`}
              type="text"
              value={image.caption}
              onChange={(e) => onChange({ ...image, caption: e.target.value })}
              onBlur={() => updateMeta(latestImageRef.current)}
              placeholder="Optionale Bildunterschrift"
              fullWidth
            />
          </div>

          <div>
            <Label htmlFor={`${label}-description`}>Beschreibung</Label>
            <Textarea
              id={`${label}-description`}
              value={image.description}
              onChange={(e) =>
                onChange({ ...image, description: e.target.value })
              }
              onBlur={() => updateMeta(latestImageRef.current)}
              placeholder="Zusätzliche Bildbeschreibung"
              rows={2}
              fullWidth
            />
          </div>
        </div>
      )}
    </div>
  );
}
