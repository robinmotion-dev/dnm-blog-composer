# Projektstand – dnm-blog-composer

Stand: 2026-02-01

## Kurzüberblick
- Projekt: Blog Composer (Next.js)
- Repository: liegt auf GitHub (bereits vorhanden)
- Ziel: Deployment auf eigenem Server (intern, nur Mitarbeiter)
- Aktueller Stand: lokale Entwicklung funktioniert, Konfiguration in `.env.local` vorhanden
- Hosting-Ziel: Hostinger VPS

## Tech-Stack
- Next.js (App Router, create-next-app Basis)
- Node.js Runtime
- Package Manager: npm (package-lock.json vorhanden)

## Wichtige Umgebungsvariablen (aus `.env.local`)
- WP_URL
- WP_REST_URL
- WP_USER
- WP_APP_PASSWORD
- DEBUG

Hinweis: Diese Variablen müssen auf dem Server als Environment gesetzt werden
(z. B. via `.env.production` oder Prozess-Manager/Service).

## Relevante Scripts (package.json Standard)
- `npm run build` (Production Build)
- `npm run start` (Startet den Production Server)
- `npm run dev` (nur lokal)

## Geplanter Deployment-Ansatz (eigener Server)
- Server mit Node.js (LTS) bereitstellen
- Repo klonen, `npm install`
- `npm run build`
- `npm run start` hinter Reverse Proxy (Nginx/Apache)
- TLS über Let’s Encrypt
- Optional: Prozess-Manager (systemd/pm2)

## Offene Punkte / Entscheidungen
- Server-Anbieter: Hostinger VPS (fix)
- Ziel-OS: voraussichtlich Ubuntu LTS (bitte bestätigen)
- Node.js Version: LTS (18.x oder 20.x, bitte festlegen)
- Reverse Proxy: Nginx oder Apache? (Empfehlung: Nginx)
- Process Manager: systemd oder pm2? (Empfehlung: systemd)
- Domain/DNS vorhanden? (Subdomain für internes Tool?)
- Zugriffsschutz: IP-Whitelist, Basic Auth oder SSO?

## Was Claude als nächstes liefern soll
Bitte erstelle eine präzise Schritt-für-Schritt-Anleitung für das Deployment
auf einem Hostinger VPS inklusive:
- Server-Voraussetzungen (OS, Node Version, Ports)
- Exakte Befehle (Clone, Install, Build, Start)
- Beispiel-Konfiguration für Reverse Proxy + TLS
- Vorschlag für Prozess-Manager
- Hinweise zur sicheren Ablage der Env-Variablen
- Minimaler Health-Check / Smoke-Test nach dem Go-Live
- Optional: Restriktionen für internen Zugriff (IP-Whitelist / Basic Auth)
