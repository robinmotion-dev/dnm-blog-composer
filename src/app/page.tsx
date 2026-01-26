export default function Home() {
  return (
    <main className="h-dvh flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="font-semibold">DNM Blog Composer</div>

        <div className="text-sm text-neutral-500">
          {/* Placeholder – Status kommt später aus Store */}
          Autosave: —
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Editor */}
        <section className="border-b lg:border-b-0 lg:border-r overflow-auto p-4">
          <div className="text-sm text-neutral-500">Editor (kommt in TASK-005+)</div>
          <div className="mt-3 rounded-lg border p-4">
            <p className="text-neutral-600">
              Platzhalter: Hier kommt der Editor rein (TitleInput, Images, Blocks, SEO, etc.).
            </p>
          </div>
        </section>

        {/* Preview */}
        <section className="overflow-auto p-4">
          <div className="text-sm text-neutral-500">Preview (kommt in TASK-014)</div>
          <div className="mt-3 rounded-lg border p-4">
            <p className="text-neutral-600">
              Platzhalter: Hier kommt die Live-Preview rein.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}