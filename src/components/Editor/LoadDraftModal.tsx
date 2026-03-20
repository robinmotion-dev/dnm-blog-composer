'use client';

import { useEffect, useState } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { BlogPost } from '@/types';
import { WPDraftSummary } from '@/lib/wordpress';
import Button from '@/components/UI/Button';
import { X, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoadDraftModalProps {
  onClose: () => void;
}

export default function LoadDraftModal({ onClose }: LoadDraftModalProps) {
  const loadPost = useEditorStore((state) => state.loadPost);
  const [drafts, setDrafts] = useState<WPDraftSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await fetch('/api/drafts');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setDrafts(data.drafts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden');
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, []);

  const handleLoad = async (draft: WPDraftSummary) => {
    if (!draft.hasComposerState) {
      toast.error('Dieser Entwurf wurde nicht mit dem Composer erstellt.');
      return;
    }

    if (
      !confirm(
        `"${draft.title}" laden? Der aktuelle Inhalt im Editor wird überschrieben.`
      )
    ) {
      return;
    }

    setLoadingId(draft.id);
    try {
      const response = await fetch(`/api/drafts?id=${draft.id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const post: BlogPost = data.post;
      loadPost(post);
      toast.success(`"${draft.title}" geladen`);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Fehler beim Laden des Entwurfs');
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <h2 className="font-semibold text-neutral-900">Entwurf aus WordPress laden</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-2">
          {loading && (
            <div className="py-10 text-center text-neutral-500 text-sm">
              Entwürfe werden geladen...
            </div>
          )}

          {error && (
            <div className="m-3 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {!loading && !error && drafts.length === 0 && (
            <div className="py-10 text-center text-neutral-500 text-sm">
              Keine Entwürfe in WordPress gefunden.
            </div>
          )}

          {!loading && drafts.map((draft) => (
            <button
              key={draft.id}
              onClick={() => handleLoad(draft)}
              disabled={loadingId === draft.id}
              className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
                draft.hasComposerState
                  ? 'hover:bg-neutral-50 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <FileText className="h-5 w-5 mt-0.5 shrink-0 text-neutral-400" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-neutral-900 truncate">
                  {draft.title}
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  Zuletzt geändert: {formatDate(draft.modified)}
                </div>
                {!draft.hasComposerState && (
                  <div className="text-xs text-amber-600 mt-0.5">
                    Nicht im Composer erstellt – kann nicht geladen werden
                  </div>
                )}
              </div>
              {loadingId === draft.id && (
                <span className="text-xs text-neutral-400 mt-0.5">Lädt...</span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Schließen
          </Button>
        </div>
      </div>
    </div>
  );
}
