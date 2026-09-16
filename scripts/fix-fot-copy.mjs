import fs from 'node:fs';

let h = fs.readFileSync('index.html', 'utf8');

h = h.replace(
  /(<section id="two"[\s\S]*?<header><h2>Futa-Dom Dystopia<\/h2><\/header>\s*<p>)[\s\S]*?(<\/p>)/,
  '$1Queens rewrite obedience into DNA. Crawl, worship, break. Full game on Steam - try the free demo first.$2'
);

h = h.replace(
  /(<section id="two"[\s\S]*?<h3>Play on Steam<\/h3>\s*<p>)[\s\S]*?(<\/p>)/,
  '$1Out now on Steam. Grab the free demo or buy the full game.$2'
);

h = h.replace(/>Futa on Top - Steam</g, '>Buy on Steam<');
h = h.replace(/>Futa on Top — Steam</g, '>Buy on Steam<');

fs.writeFileSync('index.html', h);

const css = fs.readFileSync('assets/css/fot.css', 'utf8');
const bad = [
  '#intro.intro-content',
  '.intro-footer.button',
  '#work.gallery',
  '#work.content',
  '.game-panel.content.box'
];
for (const b of bad) console.log(b, css.includes(b) ? 'STILL BAD' : 'ok');
console.log('polish', css.includes('Hero card alignment polish'));
console.log('links--2', css.includes('game-card__links--2'));

const fot = h.match(/aria-label="Futa on Top"[\s\S]*?<\/article>/)[0];
console.log('FoT patreon?', /btn-patreon/.test(fot));
console.log('FoT buy?', /Buy on Steam/.test(fot));
const two = h.match(/id="two"[\s\S]*?<\/section>/)[0];
console.log('two btns', two.match(/fot-btn[^>]*>[^<]+/g));
