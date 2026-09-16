import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync('index.html', 'utf8');
const pages = [1, 2].map(n => html.split(`id="vb-page-${n}"`)[1].split('</article>')[0]);
assert.equal((pages[0].match(/<dt>/g) || []).length, 19);
assert.equal((pages[1].match(/<dt>/g) || []).length, 6);
assert.equal((pages[1].match(/class="vb-meter"/g) || []).length, 5);
assert.equal((pages[1].match(/<ul class="vb-kinklist">([\s\S]*?)<\/ul>/)[1].match(/<li>/g) || []).length, 10);
for (const page of pages) assert.match(page, /tabindex="0" role="region"/);

if (process.argv[2]) {
  const source = fs.readFileSync(process.argv[2], 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const normalize = s => s.replace(/<\/?[a-z][^>]*>/gi, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const text = normalize(pages.join(' '));
  const content = [
    ...source.matchAll(/<tr>([\s\S]*?)<\/tr>/g),
    ...source.matchAll(/<p class="bio">([\s\S]*?)<\/p>/g),
    ...source.matchAll(/<div class="kink-row">([\s\S]*?)<\/div>/g),
    ...source.matchAll(/<ul class="protocol">([\s\S]*?)<\/ul>/g),
    ...source.matchAll(/<div class="quote">([\s\S]*?)<\/div>/g)
  ];
  for (const [index, match] of content.entries()) assert(text.includes(normalize(match[1])), `Reference content block ${index + 1} differs`);
  console.log(`Verified ${content.length} reference content blocks without omissions.`);
}
console.log('Vowbound content counts and accessible reading regions verified.');
