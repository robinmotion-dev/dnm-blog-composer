// src/app/api/publish/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createDraft, updateDraft } from '@/lib/wordpress';
import { BlogPost } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const post: BlogPost = body.post;
    console.log('[publish-route] incoming post', {
      hasWpPostId: Boolean(post?.wpPostId),
      wpPostId: post?.wpPostId ?? null,
      titleLength: post?.title?.length ?? 0,
    });
    // #region agent log
    fetch('http://127.0.0.1:7625/ingest/bc1ee6ac-1b9c-41ca-a38b-f4a0c8308643',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4e7e9a'},body:JSON.stringify({sessionId:'4e7e9a',runId:'hero-debug-2',hypothesisId:'H6',location:'src/app/api/publish/route.ts:POST',message:'Publish API called',data:{hasPost:Boolean(post),hasTitle:Boolean(post?.title),hasWpPostId:Boolean(post?.wpPostId)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

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
      console.log('[publish-route] updateDraft result', {
        requestedPostId: post.wpPostId,
        returnedPostId: result.post?.id ?? null,
      });
      // #region agent log
      fetch('http://127.0.0.1:7625/ingest/bc1ee6ac-1b9c-41ca-a38b-f4a0c8308643',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4e7e9a'},body:JSON.stringify({sessionId:'4e7e9a',runId:'hero-debug-2',hypothesisId:'H6',location:'src/app/api/publish/route.ts:POST',message:'Update draft succeeded',data:{wpPostId:post.wpPostId,returnedPostId:result.post?.id ?? null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    } else {
      // Create new draft
      result = await createDraft(post);
      message = 'Draft successfully created in WordPress';
      console.log('[publish-route] createDraft result', {
        returnedPostId: result.post?.id ?? null,
      });
      // #region agent log
      fetch('http://127.0.0.1:7625/ingest/bc1ee6ac-1b9c-41ca-a38b-f4a0c8308643',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4e7e9a'},body:JSON.stringify({sessionId:'4e7e9a',runId:'hero-debug-2',hypothesisId:'H6',location:'src/app/api/publish/route.ts:POST',message:'Create draft succeeded',data:{returnedPostId:result.post?.id ?? null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    }

    return NextResponse.json({
      success: true,
      post: result.post,
      mediaIds: result.mediaIds,
      message,
    });
  } catch (error) {
    console.error('Publish error:', error);
    // #region agent log
    fetch('http://127.0.0.1:7625/ingest/bc1ee6ac-1b9c-41ca-a38b-f4a0c8308643',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4e7e9a'},body:JSON.stringify({sessionId:'4e7e9a',runId:'hero-debug-2',hypothesisId:'H7',location:'src/app/api/publish/route.ts:POST',message:'Publish API failed',data:{errorMessage:error instanceof Error ? error.message : 'unknown'},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

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
