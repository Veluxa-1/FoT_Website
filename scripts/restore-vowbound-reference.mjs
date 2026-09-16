import fs from 'node:fs';
import assert from 'node:assert/strict';

// Import visible reference content only; never execute its scripts or handlers.
const referencePath = process.argv[2];
assert(referencePath, 'Pass the original reference HTML path');
const source = fs.readFileSync(referencePath, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
const reference = [1, 2].map(n => source.split(`id="page-${n}"`)[1].split('</section>')[0]);
let html = fs.readFileSync('index.html', 'utf8');
const inline = text => text.trim().replace(/\s+/g, ' ')
  .replace(/<span class="num">([\s\S]*?)<\/span>/g, '<b>$1</b>')
  .replace(/ < /g, ' &lt; ');
const rows = table => [...table.matchAll(/<tr>\s*<th>([\s\S]*?)<\/th>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/g)]
  .map(([, label, value]) => `<div><dt>${inline(label)}</dt><dd>${inline(value)}</dd></div>`);
const card = (title, body, modifier = '') => `<section class="vb-card${modifier}">\n<h3 class="vb-h">${title}</h3>\n${body}\n</section>`;
const tables = [...reference[0].matchAll(/<table class="matrix">([\s\S]*?)<\/table>/g)].map(m => rows(m[1]));
assert.deepEqual(tables.map(t => t.length), [5, 5, 9]);
const bio = inline(reference[0].match(/<p class="bio">([\s\S]*?)<\/p>/)[1]);
const registry = card('Body Registry', `<dl class="vb-dl vb-dl--registry">\n${[...tables[0], ...tables[1]].join('\n')}\n</dl>`);
const metrics = card('Cock Metrics', `<dl class="vb-dl">\n${tables[2].join('\n')}\n</dl>`);
const bride = `<p class="vb-bio">${bio}</p>\n${registry}\n${metrics}`;

const meters = [...reference[1].matchAll(/<div class="meter">\s*<div class="top"><span>(.*?)<\/span><strong>(.*?)<\/strong><\/div>\s*<div class="bar"><i style="width:(.*?)"><\/i><\/div>\s*<\/div>/g)]
  .map(([, label, value, width]) => `<div class="vb-meter"><div class="vb-meter__row"><span>${label}</span><b>${value}</b></div><div class="vb-meter__bar"><i style="width:${width}"></i></div></div>`);
const coefficients = [...reference[1].matchAll(/<div class="kink-row"><span class="k">(.*?)<\/span><span class="v">(.*?)<\/span><\/div>/g)]
  .map(([, label, value]) => `<li><span>${label}</span><b>${value}</b></li>`);
const session = rows(reference[1].match(/<table class="matrix">([\s\S]*?)<\/table>/)[1]);
const requirements = reference[1].match(/<ul class="protocol">([\s\S]*?)<\/ul>/)[1].trim();
const quote = inline(reference[1].match(/<div class="quote">([\s\S]*?)<\/div>/)[1]);
assert.deepEqual([meters.length, coefficients.length, session.length], [5, 10, 6]);
const protocol = `<div class="vb-pair">\n${card('Dominance Graph', `<div class="vb-meters">${meters.join('\n')}</div>`, ' vb-card--dom')}\n${card('Kink Coefficients', `<p class="vb-card-note">(0–1 intensity · self-scored)</p><ul class="vb-kinklist">${coefficients.join('\n')}</ul>`)}\n</div>\n${card('Session Mathematics', `<dl class="vb-dl">${session.join('\n')}</dl>`)}\n<div class="vb-pair">\n${card('Applicant Requirements', `<ul class="vb-rules">${requirements}</ul>`)}\n${card('Her Words · Unedited', `<blockquote class="vb-quote">${quote}</blockquote>`)}\n</div>`;
for (const [name, content] of [['bride', bride], ['proto', protocol]]) {
  const start = html.indexOf(`<div class="vb-main vb-main--${name}">`);
  const end = html.indexOf('<footer class="vb-actions">', start);
  assert(start !== -1 && end !== -1);
  html = html.slice(0, start) + `<div class="vb-main vb-main--${name}" tabindex="0" role="region" aria-label="${name === 'bride' ? 'Profile details' : 'Protocol details'}">\n${content}\n</div>\n` + html.slice(end);
}
fs.writeFileSync('index.html', html);
console.log('Restored visible reference content: 10 registry rows, 9 metric rows, 5 meters, 10 coefficients, 6 session rows.');
