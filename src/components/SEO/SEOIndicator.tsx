'use client';

import { useEditorStore } from '@/stores/editor-store';
import { analyzeSEO } from '@/lib/seo-analyzer';
import Badge from '@/components/UI/Badge';
import Card from '@/components/UI/Card';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function SEOIndicator() {
  const seo = useEditorStore((state) => state.post.seo);
  const title = useEditorStore((state) => state.post.title);
  const blocks = useEditorStore((state) => state.post.blocks);

  // Combine all content for analysis
  const content = blocks.map((b) => b.content).join(' ');

  const analysis = analyzeSEO(seo, title, content);

  const statusConfig = {
    good: {
      color: 'success' as const,
      icon: CheckCircle2,
      label: 'Gut',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    okay: {
      color: 'warning' as const,
      icon: AlertCircle,
      label: 'Okay',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    bad: {
      color: 'danger' as const,
      icon: XCircle,
      label: 'Verbesserungsbedarf',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
  };

  const config = statusConfig[analysis.status];
  const StatusIcon = config.icon;

  return (
    <Card variant="bordered" className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-700">SEO Score</h3>
        <Badge variant={config.color} size="md">
          {analysis.score}%
        </Badge>
      </div>

      <div className={`rounded-lg p-3 mb-4 ${config.bgColor}`}>
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-5 w-5 ${config.textColor}`} />
          <span className={`font-medium ${config.textColor}`}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-neutral-600 mb-2">
          Checkliste:
        </h4>
        {analysis.checks.map((check, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            {check.passed ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="font-medium text-neutral-700">{check.label}</div>
              <div
                className={`text-xs ${
                  check.passed ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {check.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
