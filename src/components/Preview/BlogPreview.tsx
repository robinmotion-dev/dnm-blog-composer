'use client';

import { useEditorStore } from '@/stores/editor-store';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import PreviewFrame from './PreviewFrame';

export default function BlogPreview() {
  const post = useEditorStore((state) => state.post);

  return (
    <PreviewFrame>
      <article className="p-6 md:p-8">
        {/* Header Image Desktop */}
        {post.headerImageDesktop.preview && (
          <div className="mb-6 -mx-6 md:-mx-8 -mt-6 md:-mt-8">
            <img
              src={post.headerImageDesktop.preview}
              alt={post.headerImageDesktop.alt || post.title}
              className="w-full h-auto"
            />
            {post.headerImageDesktop.caption && (
              <p className="text-xs text-neutral-500 mt-2 px-6 md:px-8">
                {post.headerImageDesktop.caption}
              </p>
            )}
          </div>
        )}

        {/* Title */}
        {post.title && (
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            {post.title}
          </h1>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-6 pb-6 border-b border-neutral-200">
          {post.meta.date && (
            <div>
              <span className="font-semibold">Datum:</span>{' '}
              {format(new Date(post.meta.date), 'dd. MMMM yyyy', {
                locale: de,
              })}
            </div>
          )}
          {post.meta.author && (
            <div>
              <span className="font-semibold">Autor:</span> {post.meta.author}
            </div>
          )}
          {post.meta.categories.length > 0 && (
            <div>
              <span className="font-semibold">Kategorien:</span>{' '}
              {post.meta.categories.join(', ')}
            </div>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="text-lg text-neutral-700 mb-8 italic border-l-4 border-blue-500 pl-4">
            {post.excerpt}
          </div>
        )}

        {/* Content Blocks */}
        {post.blocks.length > 0 && (
          <div className="space-y-8">
            {post.blocks.map((block) => (
              <div key={block.id} className="content-block">
                {block.type === 'text' ? (
                  <>
                    {block.headline && (
                      <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                        {block.headline}
                      </h2>
                    )}
                    {block.content && (
                      <div
                        className="prose prose-neutral max-w-none"
                        dangerouslySetInnerHTML={{ __html: block.content }}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {/* Image Block */}
                    {block.image?.preview && (
                      <figure className="my-6">
                        <img
                          src={block.image.preview}
                          alt={block.image.alt || ''}
                          className="w-full h-auto rounded-lg"
                        />
                        {block.image.caption && (
                          <figcaption className="text-sm text-neutral-600 mt-2 text-center italic">
                            {block.image.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.meta.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-semibold text-neutral-600">
                Tags:
              </span>
              {post.meta.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {post.relatedPosts.length > 0 && (
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">
              Ähnliche Artikel
            </h3>
            <ul className="space-y-2">
              {post.relatedPosts.map((relatedPost) => (
                <li key={relatedPost.id}>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {relatedPost.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Empty State */}
        {!post.title &&
          !post.excerpt &&
          post.blocks.length === 0 &&
          !post.headerImageDesktop.preview && (
            <div className="text-center py-12 text-neutral-500">
              <p className="text-lg mb-2">Keine Inhalte vorhanden</p>
              <p className="text-sm">
                Beginne mit dem Schreiben im Editor, um eine Live-Vorschau zu
                sehen.
              </p>
            </div>
          )}
      </article>
    </PreviewFrame>
  );
}
