# Veloce

**An RSVP speed reader that breathes with the text.**

One HTML file. No server, no account, no upload. Open a book, and the words come
to you — but not at a metronome's pace. Veloce slows down at commas, holds a
beat at paragraph breaks, gives long words the time they need, and speeds through
the little connective tissue your brain barely registers anyway.

[Try it](https://quitebeyond.com/veloce) · [Report a bug](https://github.com/ad2003/VELOCE-SpeedReader/issues) · GPLv3

---

## What is RSVP?

**Rapid Serial Visual Presentation.** Instead of your eyes travelling across a
line of text, the text stays still and the words are shown one at a time in a
fixed position.

Roughly a third of normal reading time is spent on *saccades* — the small jumps
your eyes make between words — and on *regressions*, the involuntary jumps back
to re-read something. RSVP removes both by removing the need to move your eyes
at all. What's left is the recognition itself.

Most RSVP implementations also align each word on its **Optimal Recognition
Point** (ORP): the character your eye naturally fixates on, usually slightly
left of centre. Keeping that point fixed means your eye never has to search for
where the word begins.

### The honest caveat

RSVP is not a free lunch, and any tool that tells you otherwise is selling
something. The best-known critique — Rayner et al., *Psychological Science in
the Public Interest* (2016) — points out that regressions aren't a bug in human
reading. They're a repair mechanism. When a sentence turns out to be
structurally ambiguous, you go back. Take that away and comprehension of
difficult text suffers, even as raw word throughput goes up.

So: RSVP is genuinely good for prose you're reading *once*, for volume, and for
material where you already know the terrain. It is a bad idea for a legal
contract, a dense paper, or poetry.

Veloce is built around that reality rather than against it. Its adaptive timing
puts the pauses back where the syntax needs them, and its Highlight modes keep
surrounding context visible so you can still see where you are — which is
precisely the affordance that pure single-word RSVP throws away.

---

## Why this one

There are plenty of RSVP tools. Here's what's actually different here, concretely:

**Timing that follows the language, not a stopwatch.**
Most readers take your WPM and divide. Veloce derives each word's duration from
sentence endings, commas, paragraph and chapter breaks, word length, quoted
speech, numbers and proper nouns, and a three-tier word-frequency model — with
an abbreviation dictionary so `Dr.`, `z.B.` and `et al.` don't trigger a false
full-stop pause. Every multiplier is exposed as a slider if you disagree with
the defaults.

**Three reading modes, not one.**
Single-word RSVP, a Highlight mode that keeps the word in its paragraph, and a
conventional reader. The Highlight mode has three sub-modes of its own —
block, centred, and a horizontally streaming ticker — with a configurable focus
window that dims or clips everything outside it.

**Smart Chunking.**
Groups words into phrases (`the old man`) instead of atomising them. Meaning
arrives in units your brain already parses as units.

**German and English linguistic models.**
Separate article, preposition, auxiliary, conjunction and adjective-suffix sets
per language, with automatic detection. Most RSVP tools are English-only and
mistime German compounds badly.

**Everything stays on your machine.**
Files are parsed in the browser. Nothing is uploaded, there is no account, no
telemetry, and — once installed — no external network requests at all.

**One file, readable, GPLv3.**
The thing you download *is* the source. Roughly 6,500 commented lines you can
open in a text editor and understand.

---

## Features

### Reading modes
- **RSVP** — one word at a time, ORP-aligned, with optional peripheral context
  (inline, dual-stream, or floating)
- **Highlight** — the active word highlighted inside its surrounding text, in
  block, centred, or streaming layout
- **Reader** — ordinary scrolling text with an optional cursor

### Pacing
- 100–2000 WPM, adjustable while reading
- Adaptive duration per word (punctuation, length, dialogue, structure, frequency)
- Seven exposed pause multipliers, individually tunable and resettable
- Smart Chunking with configurable chunk size and alignment
- Hold-to-read: press and hold to advance, release to stop

### Display
- Four themes: Dark, Light, OLED (true black), High Contrast
- Four reading fonts: Lora, Cormorant Garamond, DM Sans, JetBrains Mono
- Bionic Reading with adjustable intensity
- ORP highlighting with configurable guide line
- Independent font size, line height and page width per mode
- Configurable display border, colour and opacity

### Focus window (Highlight modes)
- Vignette or hard clip
- Adjustable height and width, mask and fade opacity
- Optional border with colour and opacity control
- Five anchor styles: solid, border, underline, accent, none

### Files
- **EPUB** (2 and 3, with table of contents extraction)
- **PDF** (text extraction; scanned PDFs without a text layer won't work)
- **FB2**, **TXT**, **Markdown**, **HTML**
- Magic-byte validation, so a mislabelled file fails with a clear message
  instead of a broken screen

### Session
- Automatic position saving, per book, with resume on reopen
- Recent-books list with progress
- Chapter navigation sidebar
- Live progress and remaining-time estimate
- Settings backup: export and import as JSON
- Screen Wake Lock — the display won't sleep mid-chapter
- Per-book settings reset

### Experimental
Soft transitions, soft start, reading pulse, word familiarisation, syntax
highlighting, WPM joystick, focus tone, live statistics. All off by default,
all clearly marked as experimental in the UI.

---

## Install

### Just use it

Open the hosted version, or download `index.html` and open it. That's the whole
installation.

On mobile, use your browser's **Add to Home Screen**. It runs standalone,
without browser chrome.

### Self-host

Copy the repository contents to any static host. HTTPS is required for the
service worker and for installability — `localhost` also counts as secure,
`file://` does not (the service worker disables itself there and the app runs
normally without offline caching).

See [DEPLOY.md](DEPLOY.md) for cache headers, MIME types, and the update
procedure.

### Two ways to run it

| | Full folder | `index.html` alone |
|---|---|---|
| Works | ✅ | ✅ |
| Installable as an app | ✅ | ❌ |
| Offline, all formats | ✅ | ❌ |
| External requests | none | fonts fall back to system, pdf.js/JSZip from CDN |

The single file still works if you copy it somewhere on its own — handy for
sharing. The full folder is the intended deployment.

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Space` | Play / pause |
| `←` `→` | One word back / forward — hold to scrub |
| `⇧←` `⇧→` | Ten words |
| `↑` `↓` | WPM ±25 |
| `⇧↑` `⇧↓` | WPM ±100 |
| `R` | RSVP mode |
| `B` | Reader mode |
| `S` | Settings |
| `F` | Fullscreen |
| `?` | Shortcut overlay |
| `Esc` | Close / exit focus |

---

## How it works

### Structure

```
index.html               the entire application
manifest.webmanifest     PWA manifest
sw.js                    service worker
assets/
  fonts/                 Lora, Cormorant Garamond, DM Sans, JetBrains Mono (OFL)
  vendor/                pdf.js 3.11.174, JSZip 3.10.1
  icon-*.png
build.js                 optional minifier for release artefacts
```

No build step, no framework, no bundler. Vanilla JavaScript in a single IIFE.
Edit the file, reload, done.

### Text pipeline

Files are read with the File API and never leave the browser. EPUBs are unzipped
with JSZip and their XHTML run through a regex cleaning pipeline — deliberately
not a DOM walker, which turned out to be both slower and more fragile on
real-world EPUBs. PDFs go through pdf.js in a Web Worker, keeping extraction off
the main thread.

Text is then tokenised into word objects carrying the metadata the timing engine
needs: punctuation class, length, paragraph and chapter boundaries, dialogue
markers, and a frequency tier.

### Timing engine

`getWordDuration()` gives the base interval from WPM. `getAdaptiveDuration()`
applies the multipliers. Advancing is driven by `requestAnimationFrame` rather
than `setTimeout` — timer drift at 800 WPM is visible, and `setTimeout` is
throttled hard on mobile once the tab loses focus.

### Loading strategy

pdf.js and JSZip aren't loaded at startup. They're fetched at the point a PDF or
EPUB is actually opened, local copy first, CDN as fallback. That keeps startup
free of roughly 400 KB of blocking JavaScript that most sessions never need.

The service worker precaches only the app shell and the fonts needed at
startup — about 350 KB. The 1.5 MB of PDF machinery is cached on first use
instead, so installing the app doesn't cost you a feature you may never touch.

### Storage

`localStorage` only: reading positions, per-book settings, recent-books list,
global stats. Writes are bound to `change` events plus a 30-second autosave,
never to the render loop.

---

## Privacy

No account. No telemetry. No analytics. No cookies. Nothing is uploaded.

Books are parsed in the browser and stay on your device. When self-hosted with
the `assets/` folder in place, the application makes **zero external network
requests** — fonts included, which is why they're bundled rather than pulled
from a CDN.

---

## Development

```bash
git clone https://github.com/ad2003//VELOCE-SpeedReader.git
cd veloce
python3 -m http.server 8000   # any static server; needed for the service worker
```

Then open `http://localhost:8000/`.

Before committing, check that every script block still parses:

```bash
node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');
[...h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].forEach((m,i)=>{
  try{new Function(m[1]);console.log('Block',i,'OK')}catch(e){console.log('Block',i,'FAIL:',e.message)}});"
```

When bumping the version, change `VELOCE_VERSION` in `index.html` **and**
`VERSION` in `sw.js` — the second one invalidates the cache, and without it
existing users keep the old build.

An optional minified artefact for releases:

```bash
npm install html-minifier-terser
node build.js index.html veloce.min.html
```

The minified file is a release convenience, not the deliverable. The readable
file is the source, which under the GPL is rather the point.

---

## Contributing

Issues and pull requests welcome. Two things worth knowing:

- Keep it a single file. The constraint is deliberate.
- Comments are load-bearing. Much of the code encodes hard-won specifics about
  mobile browser behaviour — event timing, worker throttling, iOS quirks.
  If you change something that has a comment explaining why it is the way it is,
  say why in the pull request.

---

## Licence and attribution

Copyright © 2026 **quitebeyond**

Licensed under the **GNU General Public License v3.0 or later**. See
[LICENSE](LICENSE).

You may use, modify and redistribute this software, including commercially.
In return, the GPL requires that:

- **Attribution is preserved.** The copyright notice naming *quitebeyond* and
  the link to https://github.com/ad2003/VELOCE-SpeedReader must remain in any copy or
  derivative. The notice is in the header of `index.html`; keep it there.
- **Derivatives stay under the GPL.** If you distribute a modified version, it
  must be licensed under the GPLv3 or later and its source made available.
- **Changes are marked**, so users know what they're running.

If you build something on top of Veloce, a link back is appreciated beyond what
the licence strictly requires.

Third-party components and their licences are listed in
[THIRD-PARTY.md](THIRD-PARTY.md).

---

<sub>Veloce — github.com/ad2003/VELOCE-SpeedReader — by quitebeyond</sub>
