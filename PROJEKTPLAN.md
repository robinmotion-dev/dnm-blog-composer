# DNM Blog Composer – Projektplan

> **Version:** 1.2
> **Status:** 🟢 Phase 5 - Final Polish
> **Letzte Aktualisierung:** 2026-01-29

---

## 🎯 Projektziel

Eine schlanke, interne Web-App, die es dem DNM-Team ermöglicht, Blogartikel in einem visuellen WYSIWYG-Editor zu erstellen und als Entwurf direkt nach WordPress zu übertragen.

---

## 📋 Projekt-Metadaten

```yaml
project:
  name: DNM Blog Composer
  type: Internal Tool
  stack:
    frontend: Next.js 14 (App Router), React, TypeScript
    styling: Tailwind CSS
    editor: Tiptap
    state: Zustand
    api: Next.js API Routes
    target: WordPress REST API + ACF Gutenberg Blocks
  hosting: DNM Server (Self-hosted)
  auth: Login mit allowlist + globalem Passwort
  users: 2-3 internal team members
```

---

## ⚠️ WICHTIGE ARCHITEKTUR-INFO

### WordPress verwendet ACF Gutenberg Blocks (NICHT klassische ACF-Felder!)

Die DNM WordPress-Installation nutzt **ACF Blocks** im Gutenberg-Editor. Das bedeutet:

- Daten werden **NICHT** in `post.acf` Feldern gespeichert
- Daten werden als **Gutenberg Block-Kommentare** im `post_content` gespeichert
- Format: `<!-- wp:acf/block-name {"name":"acf/block-name","data":{...}} /-->`

### Verwendete ACF Blocks:

| Block-Name | Zweck |
|------------|-------|
| `acf/blog-hero` | Header mit Bild, Datum, Autor, Kategorie |
| `acf/intro-text` | Content-Blöcke (Headline + WYSIWYG) |
| `acf/cta` | Call-to-Action Block |
| `acf/recommended-content-module` | Ähnliche Artikel |

---

# 🚀 SETUP-ANLEITUNG (Schritt für Schritt)

## Voraussetzungen

Stelle sicher, dass folgendes installiert ist:

```bash
# Prüfen ob Node.js installiert ist (min. v18)
node --version

# Prüfen ob npm/pnpm installiert ist
npm --version

# Prüfen ob Git installiert ist
git --version
```

Falls nicht installiert:

- Node.js: https://nodejs.org/ (LTS Version)
- Git: https://git-scm.com/

---

## Schritt 1: GitHub Repository erstellen

### 1.1 Auf GitHub.com

1. Öffne https://github.com/new
2. Repository Name: `dnm-blog-composer`
3. Visibility: **Private** (internes Tool)
4. ✅ Add a README file
5. ✅ Add .gitignore → Select: **Node**
6. Klicke **Create repository**

### 1.2 Repository URL kopieren

Nach dem Erstellen siehst du die Repository-Seite. Kopiere die URL:

```
https://github.com/DEIN-USERNAME/dnm-blog-composer.git
```

---

## Schritt 2: Projekt lokal klonen & öffnen

### 2.1 Terminal in VS Code öffnen

1. Öffne VS Code
2. `Cmd + Shift + P` (Mac) oder `Ctrl + Shift + P` (Windows)
3. Tippe: "Terminal: Create New Terminal"
4. Enter

### 2.2 Zum gewünschten Ordner navigieren

```bash
# Beispiel: In den Projekte-Ordner wechseln
cd ~/Projects
# oder Windows:
cd C:\Users\DEIN-NAME\Projects
```

### 2.3 Repository klonen

```bash
git clone https://github.com/DEIN-USERNAME/dnm-blog-composer.git
cd dnm-blog-composer
```

### 2.4 In VS Code öffnen

```bash
code .
```

---

## Schritt 3: Projektplan hinzufügen

### 3.1 Projektplan-Datei erstellen

1. In VS Code: Rechtsklick im Explorer → **New File**
2. Name: `PROJEKTPLAN.md`
3. Den Inhalt dieser Datei hineinkopieren
4. Speichern (`Cmd + S` / `Ctrl + S`)

### 3.2 Commit & Push

```bash
git add PROJEKTPLAN.md
git commit -m "docs: add project plan for AI agents"
git push origin main
```

---

## Schritt 4: Next.js Projekt initialisieren

### 4.1 Im Terminal ausführen

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Bei den Prompts:**

- Would you like to use Turbopack? → **No**
- (Falls gefragt) Directory not empty, continue? → **Yes**

### 4.2 Warten bis Installation fertig ist

Das dauert 1-2 Minuten. Danach solltest du diese Struktur sehen:

```
dnm-blog-composer/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── PROJEKTPLAN.md
└── README.md
```

### 4.3 Testen ob es läuft

```bash
npm run dev
```

Öffne http://localhost:3000 im Browser. Du solltest die Next.js Startseite sehen.

**Stoppen mit:** `Ctrl + C`

---

## Schritt 5: Zusätzliche Dependencies installieren

```bash
# Rich-Text Editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/pm

# State Management
npm install zustand

# Drag & Drop für Blöcke
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Icons
npm install lucide-react

# Datum-Handling
npm install date-fns

# Slug-Generierung
npm install slugify

# HTTP Client für WP API
npm install axios
```

Oder alles auf einmal:

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/pm zustand @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react date-fns slugify axios
```

### 5.1 Commit

```bash
git add .
git commit -m "chore: install dependencies"
git push origin main
```

---

## Schritt 6: Ordnerstruktur anlegen

Erstelle folgende Ordner und Dateien:

```bash
# Auf Mac/Linux:
mkdir -p src/components/{Editor,Preview,SEO,UI}
mkdir -p src/lib
mkdir -p src/stores
mkdir -p src/types

# Leere Dateien erstellen
touch src/lib/wordpress.ts
touch src/lib/storage.ts
touch src/lib/seo-analyzer.ts
touch src/stores/editor-store.ts
touch src/types/index.ts
```

**Oder manuell in VS Code:**

```
src/
├── app/
│   ├── api/
│   │   ├── publish/
│   │   │   └── route.ts
│   │   ├── posts/
│   │   │   └── route.ts
│   │   ├── categories/
│   │   │   └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Editor/
│   │   ├── TitleInput.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── ContentBlock.tsx
│   │   ├── BlockList.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── MetaFields.tsx
│   │   └── RelatedPosts.tsx
│   ├── Preview/
│   │   ├── BlogPreview.tsx
│   │   └── PreviewFrame.tsx
│   ├── SEO/
│   │   ├── SEOPanel.tsx
│   │   └── SEOIndicator.tsx
│   └── UI/
│       ├── Button.tsx
│       └── Input.tsx
├── lib/
│   ├── wordpress.ts
│   ├── storage.ts
│   └── seo-analyzer.ts
├── stores/
│   └── editor-store.ts
└── types/
    └── index.ts
```

### 6.1 Commit

```bash
git add .
git commit -m "chore: create folder structure"
git push origin main
```

---

## Schritt 7: Environment Variables einrichten

### 7.1 Datei erstellen

Erstelle im Root-Verzeichnis eine Datei `.env.local`:

```bash
touch .env.local
```

### 7.2 Inhalt einfügen

```env
# WordPress API Configuration
WP_URL=https://dnm.berlin
WP_REST_URL=https://dnm.berlin/wp-json/wp/v2
WP_USER=composer-bot
WP_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Optional: Debug Mode
DEBUG=false
```

⚠️ **Wichtig:** `.env.local` ist bereits in `.gitignore` – wird nicht committed!

### 7.3 WordPress Application Password erstellen

1. Gehe zu: `https://dnm.berlin/wp-admin/profile.php`
2. Scrolle zu "Application Passwords"
3. Name: `Blog Composer`
4. Klicke "Add New Application Password"
5. Kopiere das generierte Passwort (wird nur einmal angezeigt!)
6. Füge es in `.env.local` bei `WP_APP_PASSWORD` ein

---

## Schritt 8: KI-Agent starten

### Option A: Mit Claude Code

```bash
# Im Projektverzeichnis
claude

# Dann im Claude Code Chat:
"Lies PROJEKTPLAN.md und beginne mit TASK-001"
```

### Option B: Mit Copilot Chat in VS Code

1. `Cmd + Shift + I` (Mac) oder `Ctrl + Shift + I` (Windows)
2. Schreibe:

```
@workspace Lies PROJEKTPLAN.md und beginne mit der Implementierung von TASK-001. 
Erstelle die Basis-Komponenten für den Editor.
```

### Option C: Mit Cline/Continue

1. Öffne die Cline/Continue Sidebar
2. Schreibe:

```
Arbeite den PROJEKTPLAN.md ab. Starte mit TASK-001.
Aktualisiere den Task-Status nach Abschluss.
```

---

## Schritt 9: Entwicklung starten

```bash
# Development Server starten
npm run dev
```

Browser öffnet: http://localhost:3000

---

# 📦 TASK-LISTE (für KI-Agenten)

## Phase 1: Grundgerüst

### TASK-001: TypeScript Types definieren

```yaml
id: TASK-001
status: done
priority: high
phase: 1
agent: any
files:
  - src/types/index.ts
acceptance:
  - Alle Types für BlogPost, ContentBlock, SEOData, ImageData definiert
  - Keine TypeScript Errors
```

---

### TASK-002: Zustand Store erstellen

```yaml
id: TASK-002
status: done
priority: high
phase: 1
agent: any
depends_on: TASK-001
files:
  - src/stores/editor-store.ts
acceptance:
  - Store exportiert useEditorStore Hook
  - Alle Actions für CRUD auf BlogPost
  - LocalStorage Sync implementiert
```

---

### TASK-003: Basis-Layout erstellen

```yaml
id: TASK-003
status: done
priority: high
phase: 1
agent: any
depends_on: TASK-002
files:
  - src/app/page.tsx
  - src/app/layout.tsx
  - src/app/globals.css
acceptance:
  - Split-View Layout (50/50)
  - Editor links, Preview rechts
  - Responsive (auf kleinen Screens stacked)
  - Header mit App-Name und Status-Anzeige
```

---

### TASK-004: UI Basis-Komponenten

```yaml
id: TASK-004
status: done
priority: medium
phase: 1
agent: any
files:
  - src/components/UI/Button.tsx
  - src/components/UI/Input.tsx
  - src/components/UI/Textarea.tsx
  - src/components/UI/Label.tsx
  - src/components/UI/Card.tsx
  - src/components/UI/Badge.tsx
acceptance:
  - Alle Komponenten mit Tailwind gestyled
  - TypeScript Props definiert
  - Konsistentes Design
```

---

## Phase 2: Editor-Komponenten

### TASK-005: TitleInput Komponente

```yaml
id: TASK-005
status: done
priority: high
phase: 2
agent: any
depends_on: TASK-003, TASK-004
files:
  - src/components/Editor/TitleInput.tsx
acceptance:
  - Großes Eingabefeld für Titel
  - Verbunden mit Zustand Store
  - Placeholder "Artikel-Titel eingeben..."
```

---

### TASK-006: ImageUploader Komponente

```yaml
id: TASK-006
status: done
priority: high
phase: 2
agent: any
depends_on: TASK-004
files:
  - src/components/Editor/ImageUploader.tsx
acceptance:
  - Drag & Drop Upload
  - Click to Upload
  - Bild-Vorschau
  - Felder für Alt, Caption, Description
  - Unterstützt Desktop + Mobile Variante
```

---

### TASK-007: RichTextEditor Komponente (Tiptap)

```yaml
id: TASK-007
status: done
priority: high
phase: 2
agent: any
files:
  - src/components/Editor/RichTextEditor.tsx
acceptance:
  - Tiptap Editor integriert
  - Toolbar: Bold, Italic, Headings, Lists, Links
  - HTML Output
  - Controlled Component (value + onChange)
```

---

### TASK-008: ContentBlock Komponente

```yaml
id: TASK-008
status: done
priority: high
phase: 2
agent: any
depends_on: TASK-007
files:
  - src/components/Editor/ContentBlock.tsx
acceptance:
  - Headline Input (Vertical Headline)
  - RichTextEditor für Content
  - Delete Button
  - Drag Handle für Sortierung
```

---

### TASK-009: BlockList Komponente

```yaml
id: TASK-009
status: done
priority: high
phase: 2
agent: any
depends_on: TASK-008
files:
  - src/components/Editor/BlockList.tsx
acceptance:
  - Rendert alle ContentBlocks
  - Drag & Drop Sortierung (dnd-kit)
  - "Block hinzufügen" Button
```

---

### TASK-010: MetaFields Komponente

```yaml
id: TASK-010
status: done
priority: medium
phase: 2
agent: any
files:
  - src/components/Editor/MetaFields.tsx
acceptance:
  - Datum-Picker
  - Autor-Eingabe
  - Kategorien-Checkboxen (hardcoded erstmal)
  - Tags-Input (Komma-separiert)
```

---

### TASK-011: ExcerptInput Komponente

```yaml
id: TASK-011
status: done
priority: medium
phase: 2
agent: any
files:
  - src/components/Editor/ExcerptInput.tsx
acceptance:
  - Textarea für Teaser
  - Zeichenzähler
  - Max 300 Zeichen
```

---

## Phase 3: SEO & Preview

### TASK-012: SEOPanel Komponente

```yaml
id: TASK-012
status: done
priority: high
phase: 3
agent: any
files:
  - src/components/SEO/SEOPanel.tsx
  - src/lib/seo-analyzer.ts
acceptance:
  - SEO Title Input mit Zeichenzähler (max 60)
  - Meta Description mit Zeichenzähler (max 160)
  - Focus Keyword Input
  - URL Slug (auto-generiert, editierbar)
```

---

### TASK-013: SEOIndicator Komponente

```yaml
id: TASK-013
status: done
priority: medium
phase: 3
agent: any
depends_on: TASK-012
files:
  - src/components/SEO/SEOIndicator.tsx
acceptance:
  - Zeigt SEO-Score (Ampel: rot/gelb/grün)
  - Checklist mit Hinweisen
  - Keyword im Titel? ✓/✗
  - Keyword in Description? ✓/✗
  - Titellänge optimal? ✓/✗
```

---

### TASK-014: BlogPreview Komponente

```yaml
id: TASK-014
status: done
priority: high
phase: 3
agent: any
files:
  - src/components/Preview/BlogPreview.tsx
  - src/components/Preview/PreviewFrame.tsx
acceptance:
  - Rendert BlogPost im DNM-Design
  - Live-Update bei Änderungen
  - Desktop/Mobile Toggle
  - Scrollbar unabhängig vom Editor
```

---

### TASK-014A: Featured Image (Teaserbild) - Types & Store

```yaml
id: TASK-014A
status: done
priority: high
phase: 3
agent: any
depends_on: TASK-002
files:
  - src/types/index.ts
  - src/stores/editor-store.ts
acceptance:
  - featuredImage: ImageData zu BlogPost Type hinzufügen
  - setFeaturedImage Action im Store
  - useFeaturedImageFromHeader Option (boolean) im Store
```

---

### TASK-014B: FeaturedImageUploader Komponente

```yaml
id: TASK-014B
status: done
priority: high
phase: 3
agent: any
depends_on: TASK-014A, TASK-006
files:
  - src/components/Editor/FeaturedImageUploader.tsx
acceptance:
  - ImageUploader für Beitragsbild/Featured Image
  - Checkbox "Header-Bild als Teaserbild verwenden"
  - Wenn Checkbox aktiv: Zeige Preview mit Crop-Hinweis
  - Position nach BlockList in page.tsx
```

---

### TASK-014C: Image Blocks in Content

```yaml
id: TASK-014C
status: done
priority: high
phase: 3
agent: any
depends_on: TASK-008, TASK-009
files:
  - src/types/index.ts
  - src/stores/editor-store.ts
  - src/components/Editor/BlockList.tsx
  - src/components/Editor/ContentBlock.tsx
  - src/components/Preview/BlogPreview.tsx
acceptance:
  - ContentBlock unterstützt type: 'text' | 'image'
  - Zwei separate Buttons: "Textblock" und "Bildblock"
  - Bildblocks zeigen ImageUploader
  - Preview rendert Bildblocks mit Caption
  - Drag & Drop funktioniert für beide Block-Typen
```

---

## Phase 4: WordPress Integration

### TASK-015: WordPress API Client (ACF Gutenberg Blocks)

```yaml
id: TASK-015
status: done
priority: critical
phase: 4
agent: any
files:
  - src/lib/wordpress.ts
acceptance:
  - Generiert Gutenberg ACF Block Format (NICHT klassische ACF-Felder!)
  - Bilder werden zu WP Media Library hochgeladen
  - Blog Hero Block mit korrekten Field-IDs
  - Intro Text Blocks für Content
  - Recommended Content Module für Related Posts
  - Alle Field-IDs aus WordPress übernommen
  - wpMediaId Tracking für bereits hochgeladene Bilder
  - Draft Update Funktionalität (kein erneutes Hochladen von Bildern)
```

**KRITISCH - ACF BLOCK FORMAT:**

WordPress erwartet Content im Gutenberg Block-Format:

```html
<!-- wp:acf/blog-hero {"name":"acf/blog-hero","data":{"image":123,"_image":"field_xxx",...}} /-->
<!-- wp:acf/intro-text {"name":"acf/intro-text","data":{"field_xxx":"Headline","field_yyy":"Content"}} /-->
```

**Field-IDs aus WordPress:**

```typescript
const FIELD_IDS = {
  // Blog Hero Block
  blogHero: {
    image: 'field_6308b9807dfe5',
    mobileImage: 'field_6308b98f7dfe6',
    post: 'field_6322de3f6c2a7',
    date: 'field_640664705a3fa',
    author: 'field_63bef8f0114d2',
    category: 'field_64066558f20b2',
  },
  // Intro Text Block
  introText: {
    headline: 'field_64b7efe0ba1c3',
    content: 'field_62610ddb9a17b',
    offset: 'field_64b7f00fba1c4',
  },
  // CTA Block
  cta: {
    headline: 'field_626905a06e09a',
    content: 'field_626905ac6e09b',
    image: 'field_626905b16e09c',
  },
  // Recommended Content Module
  recommendedContent: {
    headline: 'field_62d93a6ce366b',
    recommendedPosts: 'field_62d93a7be366c',
  },
  // Common spacing fields
  common: {
    mobileMarginTop: 'field_5ed62d8f1903b',
    desktopMarginTop: 'field_5ed62dc31903c',
    mobileMarginBottom: 'field_5ed62de41903d',
    desktopMarginBottom: 'field_5ed62df71903e',
    anchor: 'field_5ed62d8f5503b',
    paddingTopDesktop: 'field_62509e7c3d718',
    paddingTopMobile: 'field_62509ebd3d71b',
    paddingBottomDesktop: 'field_62509ec93d71c',
    paddingBottomMobile: 'field_62509ed83d71d',
    backgroundColor: 'field_628770b1ab11a',
  },
};
```

**Funktionen die implementiert werden müssen:**

- `uploadMedia(file: File)` → Lädt Bild hoch, gibt WPMedia zurück
- `uploadMediaWithMeta(imageData: ImageData)` → Lädt Bild + setzt Alt/Caption
- `buildBlogHeroBlock(...)` → Generiert Blog Hero Gutenberg Block
- `buildIntroTextBlock(...)` → Generiert Intro Text Gutenberg Block  
- `buildRecommendedContentBlock(...)` → Generiert Related Posts Block
- `buildGutenbergContent(post: BlogPost)` → Kombiniert alle Blöcke
- `createDraft(post: BlogPost)` → Erstellt Post mit Gutenberg Content
- `updateDraft(postId, post)` → Aktualisiert bestehenden Post

---

### TASK-016: API Routes erstellen

```yaml
id: TASK-016
status: done
priority: high
phase: 4
agent: any
depends_on: TASK-015
files:
  - src/app/api/publish/route.ts
  - src/app/api/posts/route.ts
  - src/app/api/categories/route.ts
  - src/app/api/upload/route.ts
acceptance:
  - POST /api/publish → Erstellt Draft in WP
  - GET /api/posts → Holt Posts für Related Posts
  - GET /api/categories → Holt Kategorien
  - POST /api/upload → Lädt Bild zu WP hoch
```

---

### TASK-017: RelatedPosts Komponente

```yaml
id: TASK-017
status: done
priority: medium
phase: 4
agent: any
depends_on: TASK-016
files:
  - src/components/Editor/RelatedPosts.tsx
acceptance:
  - Lädt bestehende Posts von WP
  - Suchfeld zum Filtern
  - Multi-Select (max 3)
  - Zeigt ausgewählte Posts
```

---

### TASK-018: Publish Button & Flow

```yaml
id: TASK-018
status: done
priority: high
phase: 4
agent: any
depends_on: TASK-016
files:
  - src/components/Editor/PublishButton.tsx
acceptance:
  - Button "Als Entwurf zu WordPress"
  - Loading State während Upload
  - Erfolgs-Toast mit Link zum WP-Editor
  - Fehler-Toast bei Problemen
```

---

## Phase 5: Polish

### TASK-019: LocalStorage Autosave

```yaml
id: TASK-019
status: done
priority: medium
phase: 5
agent: any
files:
  - src/lib/storage.ts
  - (Update) src/stores/editor-store.ts
acceptance:
  - Autosave alle 30 Sekunden
  - "Entwurf wiederhergestellt" Hinweis beim Laden
  - "Entwurf löschen" Option
```

---

### TASK-020: Error Handling & Toasts

```yaml
id: TASK-020
status: done
priority: medium
phase: 5
agent: any
files:
  - src/components/UI/Toast.tsx
  - src/lib/toast.ts
acceptance:
  - Toast-System für Erfolg/Fehler/Info
  - Automatisches Ausblenden nach 5s
  - Schließen-Button
```

---

### TASK-021: Loading States

```yaml
id: TASK-021
status: done
priority: low
phase: 5
agent: any
files:
  - src/components/UI/Spinner.tsx
  - src/components/UI/Skeleton.tsx
acceptance:
  - Spinner für Buttons
  - Skeleton für Preview beim ersten Laden
```

---

### TASK-022: Final Styling & Responsive

```yaml
id: TASK-022
status: done
priority: medium
phase: 5
agent: any
files:
  - src/app/globals.css
  - (alle Komponenten)
acceptance:
  - Konsistentes Spacing
  - DNM-Farben (falls vorhanden)
  - Mobile: Tabs statt Split-View
```

---

## 📘 Laufendes Arbeitslog

### 2026-03-20

- Auth-Status geprüft: Login-Flow aktiv mit E-Mail-Allowlist (`ap`, `aw`, `rk`, `office`).
- Globales Login-Passwort festgelegt: `DNM-PW-BlogComposer`.
- Auth-Env-Doku ergänzt: `AUTH_PASSWORD` und `AUTH_SECRET` in `.env.example`.
- Login-UI verbessert: Checkbox "Passwort anzeigen" auf `src/app/login/page.tsx` ergänzt.
- Localhost-Test vorbereitet: Dependencies installiert und Dev-Server mit Host-Flag gestartet (`npm run dev -- --hostname 127.0.0.1 --port 3000`).
- Hinweis aus Laufzeit geprüft: Watcher meldet `EMFILE` (zu viele offene Dateien), App ist dennoch auf `http://127.0.0.1:3000` erreichbar.

---

# 📊 Progress Tracking

```
Phase 1: Grundgerüst     [██████████] 4/4  tasks ✓
Phase 2: Editor          [██████████] 7/7  tasks ✓
Phase 3: SEO & Preview   [██████████] 6/6  tasks ✓
Phase 4: WP Integration  [██████████] 4/4  tasks ✓
Phase 5: Polish          [██████████] 4/4  tasks ✓
─────────────────────────────────────────────
Total:                   [██████████] 25/25 tasks
```

---

# 🔧 ACF Block Referenz

## Beispiel: Vollständiger Blog Post Content

```html
<!-- wp:acf/blog-hero {"name":"acf/blog-hero","data":{
  "image":5502,
  "_image":"field_6308b9807dfe5",
  "mobile_image":5504,
  "_mobile_image":"field_6308b98f7dfe6",
  "post":["5499"],
  "_post":"field_6322de3f6c2a7",
  "date":"23-01-26",
  "_date":"field_640664705a3fa",
  "author":"DNM",
  "_author":"field_63bef8f0114d2",
  "category":["34","33"],
  "_category":"field_64066558f20b2",
  "custom_block_mobile_margin_top":"50",
  "_custom_block_mobile_margin_top":"field_5ed62d8f1903b",
  "custom_block_desktop_margin_top":"100",
  "_custom_block_desktop_margin_top":"field_5ed62dc31903c",
  ...
},"mode":"edit"} /-->

<!-- wp:acf/intro-text {"name":"acf/intro-text","data":{
  "field_64b7efe0ba1c3":"Headline hier",
  "field_62610ddb9a17b":"<p>Content hier...</p>",
  "field_64b7f00fba1c4":"0",
  ...
},"align":"left","mode":"edit"} /-->

<!-- wp:acf/recommended-content-module {"name":"acf/recommended-content-module","data":{
  "headline":"Ähnliche Artikel",
  "_headline":"field_62d93a6ce366b",
  "recommended_posts":["5237","1651"],
  "_recommended_posts":"field_62d93a7be366c",
  ...
},"mode":"edit"} /-->
```

---

# 📝 Notizen für Agenten

- Bei Unklarheiten: Frage den User
- **WICHTIG:** Nach jedem abgeschlossenen Task: Status im YAML-Block von `pending` auf `done` ändern
- Bei Blockern: Status auf `blocked` setzen und Grund notieren
- Alle Komponenten müssen TypeScript-typisiert sein
- Tailwind CSS für Styling verwenden
- Keine externen UI-Libraries (außer den installierten)
- **KRITISCH:** WordPress nutzt ACF Gutenberg Blocks, NICHT klassische ACF-Felder!
- Immer die Änderungen mit `git status` und `git diff` prüfen bevor ein Commit erstellt wird

---

# 🐛 Bekannte Issues

## Issue #1: WordPress Content Format (✅ BEHOBEN)

**Problem:** Posts wurden ohne ACF-Blocks erstellt, Bilder nicht hochgeladen.

**Ursache:** `wordpress.ts` hat klassische ACF-Felder erwartet, aber WordPress nutzt Gutenberg ACF-Blocks.

**Lösung:** `wordpress.ts` komplett neu geschrieben mit:

- Gutenberg Block-Format Generator
- Korrekten Field-IDs aus WordPress
- Bild-Upload mit Metadaten

**Status:** ✅ Behoben und getestet.

---

## Issue #2: Duplicate Drafts bei Update (✅ BEHOBEN)

**Problem:** Jeder Publish-Vorgang erstellte einen neuen Draft in WordPress, statt den bestehenden zu aktualisieren.

**Ursache:** Keine Tracking-Mechanismus für WordPress Post ID.

**Lösung:**

- `wpPostId` Field zum `BlogPost` Type hinzugefügt
- `setWpPostId()` Action im Store
- API Route prüft ob `wpPostId` existiert und ruft `updateDraft()` oder `createDraft()` auf

**Status:** ✅ Behoben und getestet.

---

## Issue #3: File Upload Error nach Page Reload (✅ BEHOBEN)

**Problem:** Nach einem Page-Reload (localStorage restore) schlugen Bild-Uploads fehl mit "Keine Daten bereitgestellt".

**Ursache:**

- File-Objekte können nicht in localStorage gespeichert werden
- Nach Reload: `preview` URLs vorhanden, aber `file` = null
- WordPress versuchte erneut hochzuladen mit null File-Objekten

**Lösung:**

- `wpMediaId` Field zu `ImageData` Type hinzugefügt
- Custom Storage implementiert, das File-Objekte vor localStorage-Speicherung filtert
- `uploadMediaWithMeta()` prüft ob `wpMediaId` existiert und überspringt Upload
- `buildGutenbergContent()` verwendet vorhandene `wpMediaId` statt erneut hochzuladen
- `setImageMediaId()` Action speichert Media IDs nach erfolgreichem Upload

**Status:** ✅ Behoben und getestet.

---

## Issue #4: Tag Input - Komma nicht eingabefähig (✅ BEHOBEN)

**Problem:** In MetaFields konnte man keine Kommas in das Tag-Input-Feld eingeben.

**Ursache:** `onChange` Event hat sofort den String gesplittet, was Komma-Eingabe verhinderte.

**Lösung:**

- Local State für Tag Input hinzugefügt
- `onBlur` statt `onChange` für Tag-Parsing
- User kann jetzt frei tippen, Tags werden erst beim Verlassen des Feldes geparst

**Status:** ✅ Behoben und getestet.

---

## Issue #5: localStorage JSON Parse Error (✅ BEHOBEN)

**Problem:** Console-Fehler: "SyntaxError: '[object Object]' is not valid JSON" beim Speichern.

**Ursache:** Custom Storage `setItem()` versuchte `JSON.parse()` auf einem Objekt, das Zustand bereits als Objekt übergab.

**Lösung:** Parameter-Type von `value: string` auf `value: any` geändert und `JSON.parse()` entfernt.

**Status:** ✅ Behoben und getestet.

---

## Issue #6: Images not uploaded on publish (? BEHOBEN)

**Problem:** Bild-Uploads landeten nicht in WordPress.

**Ursache:** Publish-Request sendete nur JSON, File-Objekte wurden nicht mitgesendet.

**Loesung:**

- Sofort-Upload beim Bild-Select ueber `/api/upload`
- Upload inkl. Alt/Caption/Description
- Meta-Updates per `/api/upload` wenn Felder geaendert werden

**Status:** ? Behoben und getestet.

---

## Issue #7: ACF blocks missing images (? BEHOBEN)

**Problem:** Blog-Hero und Bild-Block waren im WP Editor leer.

**Ursache:** ACF-Daten nur mit Feldnamen gesetzt; Bild-Block hatte leeren img src.

**Loesung:**

- ACF-Daten zusaetzlich mit Feld-Keys befuellt (field_...)
- Image-Block setzt src ueber Media-URL (per REST)

**Status:** ? Behoben und getestet.

---

## Issue #8: Kategorien stimmen nicht mit WP ueberein (? BEHOBEN)

**Problem:** Kategorien in der UI waren hardcoded und stimmten nicht mit WP ueberein.

**Ursache:** MetaFields nutzte eine statische Liste statt WP-Kategorien.

**Loesung:**

- Kategorien werden aus `/api/categories` geladen und angezeigt

**Status:** ? Behoben und getestet.

---

_Dieses Dokument wird von KI-Agenten gelesen und aktualisiert._

_Version 1.1 - 2026-01-28_
