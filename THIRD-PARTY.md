# Third-Party Components

Veloce selbst steht unter der GPLv3 (siehe LICENSE). Die mitgelieferten
Komponenten in `assets/` haben eigene Lizenzen:

## Schriften — `assets/fonts/`

Alle unter der SIL Open Font License 1.1. Lizenztexte liegen als
`LICENSE-<familie>.txt` im selben Ordner.

| Schrift | Urheber |
|---|---|
| Lora | Cyreal |
| Cormorant Garamond | Christian Thalmann / Catharsis Fonts |
| DM Sans | Colophon Foundry, Jonny Pinhorn, Indian Type Foundry |
| JetBrains Mono | JetBrains |

Enthalten ist jeweils nur das Latin-Subset in den tatsächlich verwendeten
Schnitten. Bezogen über die `@fontsource`-Pakete.

## Bibliotheken — `assets/vendor/`

| Paket | Version | Lizenz |
|---|---|---|
| pdf.js (`pdf.min.js`, `pdf.worker.min.js`) | 3.11.174 | Apache-2.0 |
| JSZip (`jszip.min.js`) | 3.10.1 | MIT oder GPLv3 |

Beide werden zur Laufzeit nur nachgeladen, wenn tatsächlich eine PDF- bzw.
EPUB-Datei geöffnet wird.
