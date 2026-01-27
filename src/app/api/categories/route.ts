// src/app/api/categories/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@/lib/wordpress';

export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories();

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch categories';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
