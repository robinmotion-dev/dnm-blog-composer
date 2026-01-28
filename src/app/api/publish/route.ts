// src/app/api/publish/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createDraft, updateDraft } from '@/lib/wordpress';
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

    let result;
    let message;

    // Check if this is an update or a new post
    if (post.wpPostId) {
      // Update existing draft
      result = await updateDraft(post.wpPostId, post);
      message = 'Draft successfully updated in WordPress';
    } else {
      // Create new draft
      result = await createDraft(post);
      message = 'Draft successfully created in WordPress';
    }

    return NextResponse.json({
      success: true,
      post: result.post,
      mediaIds: result.mediaIds,
      message,
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
