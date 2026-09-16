import fs from 'node:fs';

const protocolArticle = `<article class="vb-sheet vb-sheet--proto" id="vb-page-2" data-vb-panel="2" hidden>
							<figure class="vb-shot vb-shot--contain">
								<img src="images/throxxa/throxxa-02.webp" alt="Mistress Throxxa stroking her cock" width="1200" height="1588" loading="lazy" />
								<figcaption>The ring is optional; the collar isn't.</figcaption>
							</figure>

							<div class="vb-panel">
								<header class="vb-id">
									<h2 class="vb-title">Mating <em>Protocol</em></h2>
									<p class="vb-tagline">She does not negotiate. She seats cock and empties balls.</p>
									<ul class="vb-chips">
										<li class="hot">Non-Con</li>
										<li class="hot">Orgasm Control</li>
										<li>Pain / Power</li>
										<li class="hot">Anal</li>
										<li class="hot">Creampie Seal</li>
										<li>VowPlay</li>
									</ul>
								</header>

								<div class="vb-main vb-main--proto">
									<!-- Row 1: Dominance full width -->
									<section class="vb-card vb-card--dom">
										<div class="vb-h">Dominance Graph</div>
										<div class="vb-meters">
											<div class="vb-meter"><div class="vb-meter__row"><span>Breeding compulsion</span><b>1.00</b></div><div class="vb-meter__bar"><i style="width:100%"></i></div></div>
											<div class="vb-meter"><div class="vb-meter__row"><span>Top / penetrative control</span><b>0.98</b></div><div class="vb-meter__bar"><i style="width:98%"></i></div></div>
											<div class="vb-meter"><div class="vb-meter__row"><span>Marriage permanence</span><b>0.94</b></div><div class="vb-meter__bar"><i style="width:94%"></i></div></div>
											<div class="vb-meter"><div class="vb-meter__row"><span>Psychological ownership</span><b>0.88</b></div><div class="vb-meter__bar"><i style="width:88%"></i></div></div>
											<div class="vb-meter"><div class="vb-meter__row"><span>Aftercare (earned)</span><b>0.58</b></div><div class="vb-meter__bar"><i style="width:58%"></i></div></div>
										</div>
									</section>

									<!-- Row 2: Kinks + Session side by side -->
									<div class="vb-pair">
										<section class="vb-card">
											<div class="vb-h">Kink Coefficients</div>
											<ul class="vb-kinklist">
												<li><span>Breeding / creampie</span><b>1.00</b></li>
												<li><span>Anal - no condoms</span><b>0.96</b></li>
												<li><span>Struggle-fuck</span><b>0.94</b></li>
												<li><span>Facefuck / throat</span><b>0.91</b></li>
												<li><span>Sizeplay / shapeshift</span><b>0.89</b></li>
												<li><span>Partner chastity</span><b>0.87</b></li>
												<li><span>Collar + vow ritual</span><b>0.80</b></li>
												<li><span>Blood-scent (vampire)</span><b>0.69</b></li>
											</ul>
										</section>
										<section class="vb-card">
											<div class="vb-h">Session Mathematics</div>
											<dl class="vb-dl vb-dl--wide">
												<div><dt>Order</dt><dd>Mouth <b>3-8 min</b> -> hole seating -> grind lock <b>>=20</b> deep strokes</dd></div>
												<div><dt>Cadence</dt><dd>Idle <b>0.6-0.9 Hz</b> | peak <b>1.4-1.8 Hz</b></dd></div>
												<div><dt>Loads</dt><dd><b>(1)</b> deepest womb/ass | <b>(2)</b> throat | <b>(3)</b> tits/veil</dd></div>
												<div><dt>Leak</dt><dd>Overflow down thighs = proof | wipe without permission = insolence</dd></div>
												<div><dt>Vow</dt><dd>Spouse, seed-dump, or both | ring finger and asshole ranked equal</dd></div>
											</dl>
										</section>
									</div>

									<!-- Row 3: Rules + Quote side by side -->
									<div class="vb-pair">
										<section class="vb-card">
											<div class="vb-h">Applicant Requirements</div>
											<ul class="vb-rules">
												<li><strong>Breeding compliance</strong> - creampies stay put. Hands off. Clench and thank her.</li>
												<li><strong>Verbal surrender</strong> - <em>Bull-Mistress</em>, <em>She-King</em>, <em>Don't stop</em>. Gagging counts. Tears are lube.</li>
												<li><strong>Body for furniture</strong> - 6'5" of muscle pins, folds, benches you. Struggle triggers swell.</li>
											</ul>
										</section>
										<section class="vb-card">
											<div class="vb-h">Her Words</div>
											<blockquote class="vb-quote">
												I wore the veil so you'd understand the contract: tonight you marry my cock.
												Scratch me. Bite me. Make it hurt while I breed you - I want my orgasm filthy and bright with pain.
												Then you hold still with my cum packing your hole like a wedding seal.
												Call me Mistress when you choke. Call me your wife when you can't walk.
												If you're still empty by morning, you failed the interview.
											</blockquote>
										</section>
									</div>
								</div>

								<footer class="vb-actions">
									<button type="button" class="vb-btn vb-btn--ghost" data-vb-page="1"><- Bridecock</button>
									<a class="vb-btn vb-btn--discord" href="https://discord.gg/9Rv6EdeFwS" target="_blank" rel="noopener noreferrer">Discord</a>
									<a class="vb-btn vb-btn--patreon" href="https://www.patreon.com/futaontop" target="_blank" rel="noopener noreferrer">Patreon</a>
								</footer>
							</div>
						</article>`;

let html = fs.readFileSync('index.html', 'utf8');

// Also update page1 shot to contain full image
html = html.replace(
  /(<article class="vb-sheet vb-sheet--bride[\s\S]*?<figure class=")vb-shot(")/,
  '$1vb-shot vb-shot--contain$2'
);

const re = /<article class="vb-sheet vb-sheet--proto"[\s\S]*?<\/article>/;
if (!re.test(html)) {
  console.error('protocol article not found');
  process.exit(1);
}
html = html.replace(re, protocolArticle);
fs.writeFileSync('index.html', html);
console.log('html protocol replaced');

/* CSS updates */
let css = fs.readFileSync('assets/css/fot.css', 'utf8');

// Base shot: prefer full image visible
css = css.replace(
  /\.vb-shot img \{\s*width: 100%;\s*height: 100%;\s*object-fit: cover;\s*object-position: center top;\s*display: block;\s*\}/,
  `.vb-shot img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  .vb-shot--contain {
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(ellipse at center, rgba(60, 20, 30, 0.35), #0a0406 70%),
      #0a0406;
  }
  .vb-shot--contain img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center center;
  }`
);

const block = `
/* ---- Protocol redesign: full portrait + denser 3-row UI ---- */
@media screen and (min-width: 961px) and (min-height: 681px) {
  /* Keep balanced columns so portrait isn't squeezed/cropped awkwardly */
  .vb-sheet--proto {
    grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1.2fr) !important;
  }

  .vb-sheet--bride {
    grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1.2fr);
  }

  .vb-main--proto {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.45rem !important;
    justify-content: flex-start !important;
    height: auto !important;
    max-height: 100%;
    overflow: hidden;
  }

  .vb-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.45rem;
    min-height: 0;
    flex: 0 0 auto;
  }

  .vb-card--dom {
    flex: 0 0 auto;
  }

  .vb-meters {
    display: flex;
    flex-direction: column;
    gap: 0.28rem;
  }

  .vb-main--proto .vb-meter {
    margin: 0 !important;
  }

  .vb-main--proto .vb-kinklist {
    display: grid !important;
    grid-template-columns: 1fr;
    gap: 0.14rem !important;
    justify-content: start !important;
    flex: 0 0 auto !important;
  }

  .vb-main--proto .vb-dl {
    flex: 0 0 auto !important;
    justify-content: flex-start !important;
  }

  .vb-main--proto .vb-rules {
    flex: 0 0 auto !important;
    justify-content: flex-start !important;
    gap: 0.25rem !important;
  }

  .vb-main--proto .vb-quote {
    flex: 1 1 auto !important;
    min-height: 0;
    overflow: visible !important;
    display: block;
  }

  .vb-main--proto .vb-card {
    min-height: 0;
  }

  /* Dominance meters in a slightly tighter horizontal-friendly stack */
  .vb-card--dom .vb-meter__row {
    font-size: clamp(0.66rem, 0.9vw, 0.78rem) !important;
  }

  .vb-main--proto .vb-h {
    margin-bottom: 0.15rem;
  }
}
`;

// Replace old protocol fit polish block if present, else append
if (css.includes('Protocol fit polish')) {
  css = css.replace(/\/\* ---- Protocol fit polish[\s\S]*?(?=\/\* =+|\s*$)/, block + '\n');
} else if (css.includes('Protocol redesign')) {
  css = css.replace(/\/\* ---- Protocol redesign[\s\S]*?(?=\/\* =+|\s*$)/, block + '\n');
} else {
  css += '\n' + block;
}

fs.writeFileSync('assets/css/fot.css', css);
console.log('css updated');
