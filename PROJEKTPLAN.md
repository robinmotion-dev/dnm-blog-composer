# DNM Blog Composer – Projektplan

> **Version:** 1.0  
> **Status:** 🟡 Setup  
> **Letzte Aktualisierung:** 2026-01-25

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
    target: WordPress REST API + ACF
  hosting: DNM Server (Self-hosted)
  auth: None (internal use only)
  users: 2-3 internal team members
```

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

**Beschreibung:** Erstelle alle TypeScript Interfaces für das Projekt:

```typescript
// src/types/index.ts

export interface ImageData {
  file: File | null;
  preview: string;
  alt: string;
  caption: string;
  description: string;
}

export interface ContentBlock {
  id: string;
  headline: string;
  content: string; // HTML from Tiptap
}

export interface SEOData {
  title: string;
  description: string;
  focusKeyword: string;
  slug: string;
}

export interface MetaData {
  date: string;
  author: string;
  categories: string[];
  tags: string[];
}

export interface RelatedPost {
  id: number;
  title: string;
}

export interface BlogPost {
  title: string;
  headerImageDesktop: ImageData;
  headerImageMobile: ImageData;
  excerpt: string;
  blocks: ContentBlock[];
  meta: MetaData;
  seo: SEOData;
  relatedPosts: RelatedPost[];
}

export interface EditorState {
  post: BlogPost;
  isDirty: boolean;
  lastSaved: Date | null;
  isSaving: boolean;
  isPublishing: boolean;
}
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

**Beschreibung:** Erstelle den zentralen State Store mit Zustand:

```typescript
// src/stores/editor-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlogPost, ContentBlock, ImageData, SEOData, MetaData, RelatedPost } from '@/types';

// ... Implementation
```

Actions die benötigt werden:

- `setTitle(title: string)`
- `setExcerpt(excerpt: string)`
- `setHeaderImageDesktop(image: ImageData)`
- `setHeaderImageMobile(image: ImageData)`
- `addBlock()`
- `updateBlock(id: string, data: Partial<ContentBlock>)`
- `removeBlock(id: string)`
- `reorderBlocks(fromIndex: number, toIndex: number)`
- `setMeta(meta: Partial<MetaData>)`
- `setSEO(seo: Partial<SEOData>)`
- `setRelatedPosts(posts: RelatedPost[])`
- `resetPost()`
- `loadFromStorage()`

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

**Beschreibung:** Erstelle das Haupt-Layout mit Split-View:

```
┌─────────────────────────────────────────────────────┐
│  DNM Blog Composer              [Autosave ✓] [Push] │
├────────────────────────┬────────────────────────────┤
│                        │                            │
│  EDITOR (scrollable)   │  PREVIEW (scrollable)      │
│                        │                            │
└────────────────────────┴────────────────────────────┘
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

**Beschreibung:** Erweitere die Types und den Store um Featured Image Support:

- Neues Feld `featuredImage: ImageData` im BlogPost Interface
- Neues Feld `useFeaturedImageFromHeader: boolean` (default: false)
- Action `setFeaturedImage(image: ImageData)`
- Action `setUseFeaturedImageFromHeader(use: boolean)`
- Logik: Wenn `useFeaturedImageFromHeader` true ist, wird headerImageDesktop als Teaserbild verwendet (gecroppt)

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

**Beschreibung:** Erstelle Komponente für das Featured Image:
- Verwendet die bestehende ImageUploader Komponente
- Zusätzliche Checkbox: "Header-Bild (Desktop) als Teaserbild verwenden"
- Wenn Checkbox aktiv:
  - Zeige Info-Text: "Das Desktop Header-Bild wird automatisch als Teaserbild verwendet (wird von links/rechts gleichmäßig auf Quadrat gecroppt)"
  - Deaktiviere den Upload-Bereich
  - Zeige Preview des Header-Bildes
- Wenn Checkbox inaktiv:
  - Normaler ImageUploader für separates Teaserbild

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

**Beschreibung:** Ermöglicht das Einfügen von Bildern zwischen Textblocks:

- ContentBlock Interface erweitert um `type: 'text' | 'image'`
- Text-Blocks: `headline` + `content` (wie bisher)
- Bild-Blocks: `image: ImageData` mit Alt, Caption, Description
- BlockList zeigt zwei Buttons: "Textblock hinzufügen" und "Bildblock hinzufügen"
- ContentBlock Komponente rendert je nach type unterschiedlich
- BlogPreview zeigt Bilder als `<figure>` mit Caption
- Drag & Drop funktioniert unverändert für beide Typen

---

## Phase 4: WordPress Integration

### TASK-015: WordPress API Client

```yaml
id: TASK-015
status: pending
priority: high
phase: 4
agent: any
files:
  - src/lib/wordpress.ts
acceptance:
  - Funktionen: createDraft, uploadMedia, getCategories, getTags, getPosts
  - Error Handling
  - TypeScript Types für WP Responses
```

---

### TASK-016: API Routes erstellen

```yaml
id: TASK-016
status: pending
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
status: pending
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
status: pending
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
status: pending
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
status: pending
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
status: pending
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
status: pending
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

# 📊 Progress Tracking

```
Phase 1: Grundgerüst     [░░░░░░░░░░] 0/4  tasks
Phase 2: Editor          [░░░░░░░░░░] 0/7  tasks
Phase 3: SEO & Preview   [░░░░░░░░░░] 0/3  tasks
Phase 4: WP Integration  [░░░░░░░░░░] 0/4  tasks
Phase 5: Polish          [░░░░░░░░░░] 0/4  tasks
─────────────────────────────────────────────
Total:                   [░░░░░░░░░░] 0/22 tasks
```

---

# 🔧 Konfigurationsdateien

## ACF Field Mapping (TODO: Verifizieren!)

```yaml
# Diese Feldnamen müssen im WP-Backend geprüft werden
acf_fields:
  header_image_desktop: "image"
  header_image_mobile: "mobile_image"
  date: "date"
  author: "autor"
  category: "category"
  content_blocks: "content_blocks"  # Repeater
  content_blocks.headline: "vertical_headline"
  content_blocks.content: "content"
  related_posts: "post"

yoast_fields:
  seo_title: "_yoast_wpseo_title"
  meta_description: "_yoast_wpseo_metadesc"
  focus_keyword: "_yoast_wpseo_focuskw"
```

---

# 📝 Notizen für Agenten

- Bei Unklarheiten: Frage den User
- **WICHTIG:** Nach jedem abgeschlossenen Task: Status im YAML-Block von `pending` auf `done` ändern und in PROJEKTPLAN.md speichern
- Bei Blockern: Status auf `blocked` setzen und Grund notieren
- Alle Komponenten müssen TypeScript-typisiert sein
- Tailwind CSS für Styling verwenden
- Keine externen UI-Libraries (außer den installierten)
- Immer die Änderungen mit `git status` und `git diff` prüfen bevor ein Commit erstellt wird

---

_Dieses Dokument wird von KI-Agenten gelesen und aktualisiert._