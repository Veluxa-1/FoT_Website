import fs from 'node:fs';

/* ---- HTML: mark protocol sheet, ensure full content ---- */
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  /(<article class="vb-sheet)(" id="vb-page-2")/,
  '$1 vb-sheet--proto$2'
);

// Ensure page1 also has a sheet modifier for fit JS
html = html.replace(
  /(<article class="vb-sheet is-on" id="vb-page-1")/,
  '<article class="vb-sheet vb-sheet--bride is-on" id="vb-page-1"'
);

fs.writeFileSync('index.html', html);

/* ---- CSS: protocol denser, no clip, more text width ---- */
let css = fs.readFileSync('assets/css/fot.css', 'utf8');

// Remove overflow hidden from cards that clips children
css = css.replace(
  /\.vb-card \{([\s\S]*?)overflow: hidden;/,
  '.vb-card {$1overflow: visible;'
);

const extra = `
/* ---- Protocol fit polish (no cut, no scroll) ---- */
@media screen and (min-width: 961px) and (min-height: 681px) {
  /* Protocol: narrower portrait, wider stats */
  .vb-sheet--proto {
    grid-template-columns: minmax(220px, 0.68fr) minmax(0, 1.42fr) !important;
  }

  .vb-main {
    overflow: hidden;
  }

  .vb-main--proto {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    gap: 0.4rem !important;
    grid-template-rows: none !important;
    height: auto !important;
    max-height: 100%;
    transform-origin: top center;
  }

  .vb-main--bride {
    transform-origin: top center;
  }

  .vb-fill--proto-top,
  .vb-fill--proto-bottom {
    flex: 0 0 auto !important;
    min-height: 0;
  }

  .vb-card {
    overflow: visible !important;
    padding: 0.4rem 0.55rem !important;
    gap: 0.22rem !important;
  }

  .vb-card--session {
    padding: 0.35rem 0.55rem !important;
  }

  /* Compact meters: no empty stretch */
  .vb-main--proto .vb-meter {
    margin: 0 0 0.22rem !important;
  }
  .vb-main--proto .vb-meter:last-child {
    margin-bottom: 0 !important;
  }
  .vb-main--proto .vb-meter__row {
    font-size: clamp(0.64rem, 0.85vw, 0.74rem) !important;
    margin-bottom: 0.06rem !important;
  }
  .vb-main--proto .vb-meter__bar {
    height: 0.26rem !important;
  }

  /* Kinks: stack tightly, show all 8 */
  .vb-main--proto .vb-kinklist {
    justify-content: flex-start !important;
    gap: 0.12rem !important;
    flex: 0 0 auto !important;
  }
  .vb-main--proto .vb-kinklist li {
    padding: 0.14rem 0.32rem !important;
    font-size: clamp(0.62rem, 0.82vw, 0.72rem) !important;
  }

  .vb-main--proto .vb-dl {
    justify-content: flex-start !important;
    flex: 0 0 auto !important;
  }
  .vb-main--proto .vb-dl > div {
    padding: 0.06rem 0 !important;
  }
  .vb-main--proto .vb-dl dd {
    font-size: clamp(0.66rem, 0.88vw, 0.78rem) !important;
  }

  .vb-main--proto .vb-rules {
    justify-content: flex-start !important;
    gap: 0.18rem !important;
    flex: 0 0 auto !important;
    font-size: clamp(0.64rem, 0.85vw, 0.74rem) !important;
  }

  .vb-main--proto .vb-quote {
    flex: 0 0 auto !important;
    font-size: clamp(0.64rem, 0.85vw, 0.74rem) !important;
    line-height: 1.32 !important;
    padding: 0.35rem 0.45rem !important;
    overflow: visible !important;
  }

  .vb-main--proto .vb-h {
    font-size: 0.52rem !important;
    margin-bottom: 0.1rem;
  }

  /* When JS applies fit scale */
  .vb-main.is-fit {
    will-change: transform;
  }
}
`;

if (!css.includes('Protocol fit polish')) {
  css += extra;
}

fs.writeFileSync('assets/css/fot.css', css);

/* ---- JS: scale main content to fit available height ---- */
let js = fs.readFileSync('assets/js/fot.js', 'utf8');

const fitFn = `
  function fitVowboundPage() {
    var sheet = qs('.vb-sheet.is-on');
    if (!sheet || sheet.hasAttribute('hidden')) return;

    var panel = qs('.vb-panel', sheet);
    var main = qs('.vb-main', sheet);
    if (!panel || !main) return;

    // reset
    main.classList.remove('is-fit');
    main.style.transform = '';
    main.style.width = '';
    main.style.marginBottom = '';

    // available height inside panel for main (panel is grid: id / main / actions)
    var panelStyle = window.getComputedStyle(panel);
    var gap = parseFloat(panelStyle.rowGap || panelStyle.gap || '0') || 0;
    var idEl = qs('.vb-id', panel);
    var actions = qs('.vb-actions', panel);
    var used = (idEl ? idEl.offsetHeight : 0) + (actions ? actions.offsetHeight : 0) + gap * 2;
    var available = panel.clientHeight - used;
    if (available <= 40) return;

    // measure natural height
    var needed = main.scrollHeight;
    if (needed <= available + 1) return;

    var scale = Math.max(0.72, Math.min(1, available / needed));
    main.classList.add('is-fit');
    main.style.transformOrigin = 'top left';
    main.style.transform = 'scale(' + scale.toFixed(4) + ')';
    // keep layout space correct after scale
    main.style.width = (100 / scale).toFixed(4) + '%';
    var scaledH = needed * scale;
    main.style.marginBottom = Math.min(0, available - scaledH) + 'px';
  }

  function scheduleVowboundFit() {
    fitVowboundPage();
    window.requestAnimationFrame(fitVowboundPage);
  }
`;

// Inject fit helpers before initVowbound if missing
if (!js.includes('fitVowboundPage')) {
  js = js.replace(
    'function initVowbound()',
    fitFn + '\n  function initVowbound()'
  );
}

// Call fit after goTo and on resize
if (!js.includes('scheduleVowboundFit')) {
  js = js.replace(
    'if (indexEl) indexEl.textContent = \'PAGE 0\' + page + \' / 02\';',
    "if (indexEl) indexEl.textContent = 'PAGE 0' + page + ' / 02';\n      scheduleVowboundFit();"
  );

  js = js.replace(
    'goTo(1);\n  }',
    `goTo(1);
    window.addEventListener('resize', function () {
      window.clearTimeout(window.__vbFitT);
      window.__vbFitT = window.setTimeout(scheduleVowboundFit, 80);
    });
    // images can affect layout
    qsa('.vb-shot img').forEach(function (img) {
      if (!img.complete) img.addEventListener('load', scheduleVowboundFit, { once: true });
    });
  }`
  );
}

fs.writeFileSync('assets/js/fot.js', js);
console.log('updated html/css/js');

// verify content counts
const h = fs.readFileSync('index.html', 'utf8');
const two = h.match(/id="vb-page-2"[\s\S]*?<\/article>/)[0];
console.log('meters', (two.match(/class="vb-meter"/g) || []).length);
console.log('kink lis', (two.match(/vb-kinklist[\s\S]*?<\/ul>/)[0].match(/<li>/g) || []).length);
console.log('interview', /failed the interview/.test(two));
console.log('sheet proto class', /vb-sheet--proto/.test(h));
