# Veloce — Deployment

## Struktur

```
index.html               die App (weiterhin alles in einer Datei)
manifest.webmanifest     PWA-Manifest
sw.js                    Service Worker (Offline-Cache)
assets/
  fonts/                 Lora, Cormorant Garamond, DM Sans, JetBrains Mono (SIL OFL)
  vendor/                pdf.js 3.11.174, JSZip 3.10.1
  icon-*.png             App-Icons
```

## Zwei Betriebsarten

**Vollständig (empfohlen)** — den ganzen Ordner hochladen.
Keine externen Requests, installierbar als PWA, funktioniert offline
inklusive EPUB und PDF.

**Standalone** — nur `index.html` irgendwohin kopieren.
Funktioniert weiterhin, lädt Schriften systemseitig und holt pdf.js/JSZip
bei Bedarf vom CDN. Kein Offline-Support für PDF/EPUB. Praktisch zum
schnellen Weitergeben, nicht als Hauptauslieferung gedacht.

## Hosting

Statisches Hosting genügt (Netlify, Vercel, GitHub Pages, eigener nginx).
Zwei Punkte beachten:

- **HTTPS ist Pflicht** für Service Worker und Installierbarkeit.
  `localhost` gilt als sicher, `file://` nicht — dort deaktiviert sich
  der Service Worker still und die App läuft im Normalmodus weiter.
- **Kein aggressives Caching auf `sw.js`.** Sonst bekommen Nutzer neue
  Versionen erst verzögert. Beispiel nginx:

  ```nginx
  location = /sw.js { add_header Cache-Control "no-cache"; }
  location = /veloce.html { add_header Cache-Control "no-cache"; }
  location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
  ```

## Beim Versions-Update

1. `VELOCE_VERSION` in `veloce.html` hochsetzen
2. `VERSION` in `sw.js` auf denselben Wert setzen — das invalidiert den
   alten Cache, sonst sehen bestehende Nutzer die alte Version weiter
3. Syntax-Check laufen lassen (siehe Handoff)

## Optional: minifizierte Variante

`build.js` erzeugt aus `veloce.html` eine minifizierte Fassung
(−30 %, ~85 KB gzip). Gedacht als Release-Artefakt, nicht als
Hauptauslieferung — die lesbare Datei ist bei GPLv3 gleichzeitig
der Quellcode.

```bash
npm install html-minifier-terser
node build.js veloce.html veloce.min.html
```

## Lizenzen Dritter

- Schriften: SIL Open Font License 1.1 (`assets/fonts/LICENSE-*.txt`)
- pdf.js, JSZip: Apache-2.0 bzw. MIT/GPLv3
