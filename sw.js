/* Veloce Service Worker
 * Copyright (C) 2026 quitebeyond — GPLv3
 *
 * Strategie:
 *   App-Shell (HTML, Fonts, Icons) -> Precache beim Install. Klein genug (~350 KB),
 *     damit die Installation schnell ist und Offline sofort funktioniert.
 *   Vendor-Libraries (pdf.js, jszip) -> KEIN Precache. Zusammen ~1.5 MB, aber nur
 *     relevant wenn der Nutzer wirklich ein PDF oder EPUB oeffnet. Werden beim
 *     ersten Gebrauch gecacht (cache-first) und sind ab dann offline verfuegbar.
 *   HTML -> stale-while-revalidate: sofortiger Start aus dem Cache, Update laeuft
 *     im Hintergrund und greift beim naechsten Oeffnen.
 */
const VERSION = '55.70';
const SHELL = `veloce-shell-v${VERSION}`;
const RUNTIME = `veloce-runtime-v${VERSION}`;

const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-512.png',
  './assets/apple-touch-icon.png',
  './assets/favicon-32.png',
  // Nur die Schnitte, die beim Start wirklich gebraucht werden. Der Rest
  // (weitere Lesefonts) wird bei Auswahl per Runtime-Cache nachgezogen.
  './assets/fonts/dm-sans-latin-400-normal.woff2',
  './assets/fonts/dm-sans-latin-500-normal.woff2',
  './assets/fonts/dm-sans-latin-600-normal.woff2',
  './assets/fonts/dm-sans-latin-700-normal.woff2',
  './assets/fonts/lora-latin-400-normal.woff2',
  './assets/fonts/lora-latin-700-normal.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL)
      // addAll bricht komplett ab wenn EINE Datei fehlt -> einzeln adden,
      // damit eine fehlende optionale Datei die Installation nicht killt.
      .then(c => Promise.all(PRECACHE.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Fremde Origins (z.B. CDN-Fallback) nicht anfassen — sollen normal durchlaufen.
  if (url.origin !== self.location.origin) return;

  const isDoc = req.mode === 'navigate' || url.pathname.endsWith('.html');

  if (isDoc) {
    // stale-while-revalidate
    e.respondWith(
      caches.open(SHELL).then(async cache => {
        // Navigation auf das Verzeichnis (z.B. /veloce/) trifft nicht
        // automatisch den unter './index.html' abgelegten Cache-Eintrag.
        // Darum zweistufig suchen.
        const cached = await cache.match(req, { ignoreSearch: true })
                    || await cache.match('./index.html', { ignoreSearch: true });
        const network = fetch(req)
          .then(res => { if (res.ok) cache.put(req, res.clone()); return res; })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Alles andere: cache-first, bei Miss holen und in den Runtime-Cache legen.
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(RUNTIME).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
