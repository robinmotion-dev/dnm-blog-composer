# Dev-Tools zwischen Mac & PC synchron halten

Ziel: Auf allen Rechnern dieselbe **Basis-Toolchain** und nachvollziehbare **Update-Schritte**.  
Automatisch geht nur, was per CLI sicher aktualisierbar ist; **Cursor** und ähnliche Apps bleiben bewusst manuell (stabiler, weniger Überraschungen).

## Schnell-Check im Repo

```bash
npm run check:env
```

Ausgabe: aktuelle Versionen der erkannten CLIs. Ergebnis mit anderen Rechnern oder mit `scripts/dev-env-expected.json` vergleichen.

## Checkliste (einmal pro Maschine / nach größeren Updates)

| Tool | Prüfen | Mac aktualisieren | Windows aktualisieren |
|------|--------|-------------------|------------------------|
| **Node.js** | `node -v` | Homebrew: `brew upgrade node` · oder [nvm](https://github.com/nvm-sh/nvm)/[fnm](https://github.com/Schniz/fnm) | [nodejs.org](https://nodejs.org/) LTS · oder nvm-windows |
| **npm** | `npm -v` | kommt mit Node; ggf. `npm install -g npm@latest` | wie Mac |
| **Git** | `git --version` | `brew upgrade git` | [git-scm.com](https://git-scm.com/download/win) oder `winget install Git.Git` |
| **Projekt-Deps** | im Repo: `npm ci` oder `npm install` | — | — |
| **GitHub CLI `gh`** | `gh --version` | `brew upgrade gh` | `winget upgrade GitHub.cli` |
| **Vercel CLI** | `npx vercel --version` | `npm i -g vercel@latest` (optional) | wie Mac |
| **Cursor** | App: **Cursor → Check for Updates** | wie links | wie links |
| **Claude Code / CLI** | je nach Setup (z. B. `claude --version` falls installiert) | Installer/Updater des jeweiligen Produkts | wie Mac |

### Empfohlene Node-Version für dieses Projekt

Siehe `package.json` → Feld **`engines.node`**. Liegt deine Version darunter, zuerst Node angleichen, dann im Projektordner:

```bash
npm install
```

## Was das Skript **nicht** macht

- Installiert oder upgraded **keine** GUI-Apps (Cursor, Browser).
- Schreibt nichts auf dein System außer der Konsolen-Ausgabe.
- „Erwartete“ Versionen in `scripts/dev-env-expected.json` sind **Richtwerte**; bei Abweichung nur Hinweis in der Ausgabe, kein Auto-Fix.

## Abgleich zwischen zwei Rechnern

1. Auf Rechner A: `npm run check:env` → Ausgabe kopieren oder Screenshot.
2. Auf Rechner B: dasselbe.
3. Abweichungen mit der Tabelle oben schließen.
4. Im Repo immer: `git pull` → `npm install` → `npm run build` als Smoke-Test.
