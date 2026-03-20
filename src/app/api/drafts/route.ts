import { NextRequest, NextResponse } from 'next/server';
import { getDrafts, getDraftWithState } from '@/lib/wordpress';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const post = await getDraftWithState(parseInt(id, 10));
      if (!post) {
        return NextResponse.json(
          { error: 'Kein Composer-State in diesem Entwurf gefunden.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ post });
    }

    const drafts = await getDrafts();
    return NextResponse.json({ drafts });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fehler beim Laden der Entwürfe';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
