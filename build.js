#!/usr/bin/env node
/**
 * Veloce Build — erzeugt aus der lesbaren Quelldatei eine minifizierte
 * Auslieferungsversion. Die Quelle bleibt unangetastet (Kommentare, Formatierung).
 *
 * Usage: node build.js veloce.html veloce.min.html
 */
const fs = require('fs');
const { minify } = require('html-minifier-terser');

const [, , IN = 'veloce.html', OUT = 'veloce.min.html'] = process.argv;

(async () => {
  const src = fs.readFileSync(IN, 'utf8');

  // Lizenz-Header (GPL) muss erhalten bleiben — vorher rausschneiden.
  const licMatch = src.match(/<!--[\s\S]*?GNU General Public License[\s\S]*?-->/);
  const license = licMatch ? licMatch[0] : '';

  const out = await minify(src, {
    // --- HTML ---
    collapseWhitespace: true,
    conservativeCollapse: true,   // nie ganz entfernen, nur auf 1 Space -> kein Layout-Shift
    removeComments: true,
    removeRedundantAttributes: false,  // type="text" etc. behalten (Safari-Quirks)
    removeAttributeQuotes: false,      // Quotes behalten -> weniger Parser-Risiko
    keepClosingSlash: true,
    caseSensitive: true,               // SVG/camelCase-Attribute nicht zerstoeren

    // --- CSS ---
    minifyCSS: { level: { 1: { specialComments: 0 } } },

    // --- JS ---
    minifyJS: {
      compress: {
        toplevel: false,      // KRITISCH: Script-Bloecke teilen sich Top-Level-Scope
        drop_debugger: true,
        drop_console: false,  // eigener Debug-Gate im Code, nicht anfassen
      },
      mangle: {
        toplevel: false,      // KRITISCH: window._applyFocusFrame & Co. muessen bleiben
        reserved: ['VELOCE_VERSION'],
      },
      format: { comments: false },
    },
  });

  fs.writeFileSync(OUT, license ? license + '\n' + out : out);

  const a = Buffer.byteLength(src), b = Buffer.byteLength(fs.readFileSync(OUT));
  console.log(`${IN}: ${(a / 1024).toFixed(1)} KB  ->  ${OUT}: ${(b / 1024).toFixed(1)} KB  (-${(100 - b / a * 100).toFixed(1)}%)`);
})();
