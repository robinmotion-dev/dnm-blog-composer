// src/app/api/posts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/lib/wordpress';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;

    const posts = await getPosts(search);

    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error('Get posts error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch posts';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
