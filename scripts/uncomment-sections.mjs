import fs from 'node:fs';

let html = fs.readFileSync('index.html', 'utf8');

// Uncomment any HTML-comment-wrapped sections for #one / #two
html = html.replace(/<!--\s*(<section id="(?:one|two)"[\s\S]*?<\/section>)\s*-->/g, '$1');

// If still start-commented without clean wrapper, strip leading <!-- before section and trailing --> after
html = html.replace(/<!--\s*(<section id="one")/g, '$1');
html = html.replace(/<!--\s*(<section id="two")/g, '$1');

// Remove orphan close-comment markers that sat after those sections
html = html.replace(/(<\/section>)\s*-->/g, (m, close, offset) => {
  // only strip if near one/two context
  const before = html.slice(Math.max(0, offset - 400), offset);
  if (/id="(?:one|two)"/.test(before) || /Futa Heim|Futa on Top/.test(before)) return close;
  return m;
});

// FoT #two CTA card: free demo + buy on steam + itch, no patreon
html = html.replace(
  /(<section id="two"[\s\S]*?<div class="btn-row">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/aside>)/,
  `$1
							<a class="fot-btn fot-btn--play fot-btn--block" href="https://store.steampowered.com/app/4272570/Futa_on_Top/" target="_blank" rel="noopener noreferrer">Play Free Demo</a>
							<a class="fot-btn fot-btn--steam fot-btn--block" href="https://store.steampowered.com/app/4272570/Futa_on_Top/" target="_blank" rel="noopener noreferrer">Buy on Steam</a>
							<a class="fot-btn fot-btn--itch fot-btn--block" href="https://futaontop.itch.io/" target="_blank" rel="noopener noreferrer">itch.io</a>
						$3`
);

// Support label
html = html.replace(/>Futa on Top - Steam</g, '>Buy on Steam<');

fs.writeFileSync('index.html', html);
console.log('done');

const ids = [...html.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]);
console.log('sections:', ids.join(', '));
console.log('still commented one?', /<!--\s*<section id="one"/.test(html));
console.log('still commented two?', /<!--\s*<section id="two"/.test(html));
