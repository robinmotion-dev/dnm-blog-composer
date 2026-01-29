// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { uploadMediaWithMeta, updateMediaMeta } from '@/lib/wordpress';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = (formData.get('alt') as string) || '';
    const caption = (formData.get('caption') as string) || '';
    const description = (formData.get('description') as string) || '';
    const mediaIdValue = formData.get('mediaId') as string | null;

    if (!file && !mediaIdValue) {
      return NextResponse.json(
        { error: 'No file or mediaId provided' },
        { status: 400 }
      );
    }

    // Update metadata only (existing media)
    if (!file && mediaIdValue) {
      const mediaId = Number(mediaIdValue);
      if (!Number.isFinite(mediaId)) {
        return NextResponse.json(
          { error: 'Invalid mediaId provided' },
          { status: 400 }
        );
      }

      await updateMediaMeta(mediaId, { alt, caption, description });

      return NextResponse.json({
        success: true,
        mediaId,
        message: 'Media metadata successfully updated',
      });
    }

    // Upload to WordPress with metadata
    const wpMediaId = await uploadMediaWithMeta({
      file,
      preview: '',
      alt,
      caption,
      description,
      wpMediaId: null,
    });

    return NextResponse.json({
      success: true,
      mediaId: wpMediaId,
      message: 'File successfully uploaded to WordPress',
    });
  } catch (error) {
    console.error('Upload error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to upload file';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
