// src/components/Preview/PreviewSkeleton.tsx

import Skeleton, { SkeletonImage, SkeletonText } from '@/components/UI/Skeleton';

export default function PreviewSkeleton() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header Image */}
      <SkeletonImage className="h-64 -mx-6 md:-mx-8 -mt-6 md:-mt-8" />

      {/* Title */}
      <Skeleton height="2.5rem" width="80%" />

      {/* Meta Info */}
      <div className="flex gap-4 pb-6 border-b border-neutral-200">
        <Skeleton height="1rem" width="120px" />
        <Skeleton height="1rem" width="150px" />
        <Skeleton height="1rem" width="100px" />
      </div>

      {/* Excerpt */}
      <SkeletonText lines={3} />

      {/* Content Blocks */}
      <div className="space-y-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-3">
            {/* Block Headline */}
            <Skeleton height="1.5rem" width="60%" />
            {/* Block Content */}
            <SkeletonText lines={4} />
          </div>
        ))}
      </div>

      {/* Related Posts */}
      <div className="pt-6 border-t border-neutral-200 space-y-3">
        <Skeleton height="1.5rem" width="150px" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="3rem" />
          ))}
        </div>
      </div>
    </div>
  );
}
