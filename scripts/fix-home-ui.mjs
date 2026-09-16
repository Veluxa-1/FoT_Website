import fs from 'node:fs';

/* ---- CSS selector + layout fixes ---- */
const cssPath = 'assets/css/fot.css';
let css = fs.readFileSync(cssPath, 'utf8');

const selectorFixes = [
  [/#intro\.intro-content/g, '#intro .intro-content'],
  [/\.intro-footer\.button\.style2\.down/g, '.intro-footer .button.style2.down'],
  [/\.game-panel__copy\.content\.box\.style2/g, '.game-panel__copy .content.box.style2'],
  [/\.game-panel\.content\.box\.style2/g, '.game-panel .content.box.style2'],
  [/#one\.button\.style2\.down\.anchored/g, '#one .button.style2.down.anchored'],
  [/#two\.button\.style2\.down\.anchored/g, '#two .button.style2.down.anchored'],
  [/#work\.content/g, '#work .content'],
  [/#work\.gallery article a/g, '#work .gallery article a'],
  [/#work\.gallery article/g, '#work .gallery article'],
  [/#work\.gallery/g, '#work .gallery'],
  [/#intro\.main\.style1 >\.content/g, '#intro.main.style1 > .content'],
  [/#intro\.main\.style1\.inactive >\.content/g, '#intro.main.style1.inactive > .content'],
  [/\.footer-bottom\.icons/g, '.footer-bottom .icons'],
  [/\.footer-bottom\.icons li a/g, '.footer-bottom .icons li a'],
  [/\.steam-band\.btn-row/g, '.steam-band .btn-row'],
];

for (const [re, rep] of selectorFixes) css = css.replace(re, rep);

const polish = `
/* ---- Hero card alignment polish ---- */
#intro .intro-content {
  align-items: center !important;
  text-align: center;
}

.intro-header {
  width: 100%;
  margin-inline: auto;
  text-align: center;
}

.intro-sub {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.game-cards {
  align-items: stretch;
  justify-content: center;
  margin-inline: auto;
}

.game-card {
  text-align: left;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.game-card__body {
  padding: 1rem 1.2rem 1.2rem !important;
  gap: 0.85rem !important;
  flex: 1 1 auto;
}

.game-card__title {
  margin: 0 !important;
  text-align: left;
}

.game-card__desc {
  min-height: 3.15em;
}

.game-card__actions {
  gap: 0.75rem !important;
  margin-top: auto !important;
  width: 100%;
}

.game-card__links {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem !important;
  width: 100%;
}

.game-card__links--2 {
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
}

.btn-play {
  width: 100% !important;
  margin: 0 !important;
  box-sizing: border-box;
}

.btn-social {
  width: 100% !important;
  justify-content: center !important;
  padding: 0 0.7rem !important;
  gap: 0.4rem !important;
  box-sizing: border-box;
}

.intro-footer {
  width: 100%;
  align-items: center !important;
  justify-content: center !important;
  gap: 1.15rem !important;
}

.intro-cta-strip {
  justify-content: center !important;
  align-items: center;
  gap: 0.75rem !important;
  width: auto;
  margin-inline: auto;
}

.intro-cta-strip .fot-btn {
  min-width: 8.75rem;
}

@media screen and (max-width: 900px) {
  .game-card__desc { min-height: 0; }
  .game-card__links {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
  .game-card__links--2 {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

@media screen and (max-width: 480px) {
  .game-card__links,
  .game-card__links--2 {
    grid-template-columns: 1fr !important;
  }
  .intro-cta-strip {
    width: 100%;
  }
  .intro-cta-strip .fot-btn {
    min-width: 0;
    flex: 1 1 calc(50% - 0.5rem);
  }
}
`;

if (!css.includes('Hero card alignment polish')) {
  css += polish;
}

fs.writeFileSync(cssPath, css);
console.log('css updated');

/* ---- HTML FoT CTA updates ---- */
const htmlPath = 'index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace FoT card secondary links only (second game-card block)
const fotCardRe =
  /(<article class="game-card" aria-label="Futa on Top"[\s\S]*?<div class="game-card__actions">[\s\S]*?<div class="game-card__links)(">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/div>\s*<\/article>)/;

if (!fotCardRe.test(html)) {
  console.error('FoT card block not found');
  process.exit(1);
}

html = html.replace(
  fotCardRe,
  `$1 game-card__links--2$2
									<a href="https://store.steampowered.com/app/4272570/Futa_on_Top/" class="btn-social btn-steam" target="_blank" rel="noopener noreferrer" title="Buy on Steam"><i class="icon brands fa-steam" aria-hidden="true"></i><span> Buy on Steam</span></a>
									<a href="https://futaontop.itch.io/" class="btn-social btn-itch" target="_blank" rel="noopener noreferrer" title="itch.io"><i class="icon brands fa-itch-io" aria-hidden="true"></i><span> itch.io</span></a>
								$4`
);

// FoT deep-dive (#two) if present: demo + buy, no patreon in that CTA card
html = html.replace(
  /(<section id="two"[\s\S]*?<div class="btn-row">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/aside>)/,
  `$1
							<a class="fot-btn fot-btn--play fot-btn--block" href="https://store.steampowered.com/app/4272570/Futa_on_Top/" target="_blank" rel="noopener noreferrer">Play Free Demo</a>
							<a class="fot-btn fot-btn--steam fot-btn--block" href="https://store.steampowered.com/app/4272570/Futa_on_Top/" target="_blank" rel="noopener noreferrer">Buy on Steam</a>
							<a class="fot-btn fot-btn--itch fot-btn--block" href="https://futaontop.itch.io/" target="_blank" rel="noopener noreferrer">itch.io</a>
						$3`
);

fs.writeFileSync(htmlPath, html);
console.log('html updated');
