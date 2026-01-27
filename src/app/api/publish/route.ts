// src/app/api/publish/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createDraft } from '@/lib/wordpress';
import { BlogPost } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const post: BlogPost = body.post;

    if (!post || !post.title) {
      return NextResponse.json(
        { error: 'Invalid post data. Title is required.' },
        { status: 400 }
      );
    }

    // Create draft in WordPress
    const wpPost = await createDraft(post);

    return NextResponse.json({
      success: true,
      post: wpPost,
      message: 'Draft successfully created in WordPress',
    });
  } catch (error) {
    console.error('Publish error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to publish post';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
