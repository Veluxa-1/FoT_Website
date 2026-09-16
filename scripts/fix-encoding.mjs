import fs from 'node:fs';
import path from 'node:path';

const roots = ['.'];
const exts = new Set(['.html', '.js', '.css', '.json', '.md', '.txt', '.xml', '.yml', '.yaml', '.mjs']);

const replacements = [
 // Classic UTF-8 read as Windows-1252 / Latin-1 mojibake
 [' | ', ' | '],
 [' ', ' '],
 [''', "'"],
 [''', "'"],
 ['"', '"'],
 ['â€\u009d', '"'],
 ['"', '"'],
 ['â€\u009c', '"'],
 [' - ', ' - '],
 ['-', '-'],
 ['...', '...'],
 ['x', 'x'],
 ['x', 'x'],
 [' -> ', ' -> '],
 [' <- ', ' <- '],
 [' / ', ' / '],
 ['*', '*'],
 ['', ''],
 ['', ''],
 ['', ''],
 [' -> ', ' -> '],
 [' <- ', ' <- '],
 ['*', '*'],
 ['x', 'x'],
 ['...', '...'],
 [' - ', ' - '],
 ['-', '-'],
 [''', "'"],
 [''', "'"],
 ['"', '"'],
 ['"', '"'],
 // stray C2 A0 nbsp issues sometimes show oddly
];

// Final safe ASCII normalization (no fancy punctuation - avoids encoding breakage)
const unicodeToSafe = [
 [/\u00B7/g, ' | '], // middle dot
 [/ | /g, ' | '],
 [/\u00B6/g, ''], // pilcrow leftovers
 [/ - /g, ' - '],
 [/-/g, '-'],
 [/ -> /g, ' -> '],
 [/ <- /g, ' <- '],
 [/ / /g, ' / '],
 [/|||/g, ''],
 [/.../g, '...'],
 [/"|"/g, '"'],
 [/'|'/g, "'"],
 [/x/g, 'x'],
 [/*/g, '*'],
 [/'/g, "'"],
 [/"/g, '"'],
 [/~/g, '~'],
 [/>=/g, '>='],
 [/<=/g, '<='],
 // common double-encoded leftovers still present as literal multi-char
 [/ | /g, ' | '],
 [//g, ''],
 [/x/g, 'x'],
];

function walk(dir, out = []) {
 for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
 if (ent.name === '.git' || ent.name === 'node_modules' || ent.name === 'images' || ent.name === 'webfonts') continue;
 const p = path.join(dir, ent.name);
 if (ent.isDirectory()) walk(p, out);
 else if (exts.has(path.extname(ent.name).toLowerCase())) out.push(p);
 }
 return out;
}

function fix(text) {
 let t = text;
 // If file was double-encoded, fix mojibake first
 for (const [a, b] of replacements) t = t.split(a).join(b);

 // Convert remaining fancy unicode in HTML/JS/CSS text to plain ASCII
 for (const [re, rep] of unicodeToSafe) t = t.replace(re, rep);

 // Collapse weird spaces around middot separators
 t = t.replace(/[ \t]* | [ \t]*/g, ' | ');
 t = t.replace(/ \u00a0/g, ' ');
 t = t.replace(/\u00a0/g, ' ');
 // tidy multiple spaces created by replacements (not newlines)
 t = t.replace(/[^\S\r\n]{2,}/g, ' ');
 t = t.replace(/ \./g, '.');
 return t;
}

const files = walk('.');
let changed = 0;
for (const f of files) {
 const raw = fs.readFileSync(f);
 // skip binary-ish
 if (raw.includes(0)) continue;
 const before = raw.toString('utf8');
 const after = fix(before);
 if (after !== before) {
 fs.writeFileSync(f, after, 'utf8');
 changed++;
 console.log('fixed', f);
 }
}
console.log('done, changed', changed);
