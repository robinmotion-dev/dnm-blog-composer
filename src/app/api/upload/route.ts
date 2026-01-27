// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { uploadMedia } from '@/lib/wordpress';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload to WordPress
    const wpMedia = await uploadMedia(file);

    return NextResponse.json({
      success: true,
      media: wpMedia,
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
