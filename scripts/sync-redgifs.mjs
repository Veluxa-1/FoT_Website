import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const user = process.env.REDGIFS_USER || 'veluxa';
const count = Number(process.env.REDGIFS_COUNT || 6);
const outFile = resolve(process.env.REDGIFS_OUT || 'data/redgifs.json');
const thumbDir = resolve(process.env.REDGIFS_THUMB_DIR || 'images/thumbs');

async function readJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`${url} returned HTTP ${res.status}`);
  }
  return res.json();
}

const auth = await readJson('https://api.redgifs.com/v2/auth/temporary');
const token = auth.token;

if (!token) {
  throw new Error('Redgifs did not return a temporary token.');
}

const api = new URL(`https://api.redgifs.com/v2/users/${encodeURIComponent(user)}/search`);
api.searchParams.set('order', 'new');
api.searchParams.set('page', '1');
// Redgifs can return fewer items than requested for small counts, so over-fetch
// and trim locally to keep the site's six-card layout filled.
api.searchParams.set('count', String(Math.max(count * 2, count)));
api.searchParams.set('type', 'g');

const data = await readJson(api, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const gifs = Array.isArray(data.gifs) ? data.gifs.slice(0, count) : [];
async function cacheThumbnail(gif) {
  const source = gif.urls?.thumbnail || gif.urls?.poster || '';
  if (!gif.id || !source) return '';

  const extMatch = new URL(source).pathname.match(/\.(jpg|jpeg|png|webp)$/i);
  const ext = extMatch ? extMatch[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
  const fileName = `redgifs-${gif.id}.${ext}`;
  const outPath = resolve(thumbDir, fileName);

  const res = await fetch(source);
  if (!res.ok) throw new Error(`Thumbnail ${source} returned HTTP ${res.status}`);

  const bytes = Buffer.from(await res.arrayBuffer());
  await mkdir(thumbDir, { recursive: true });
  await writeFile(outPath, bytes);
  return `images/thumbs/${fileName}`;
}

const items = [];
for (const gif of gifs) {
  let localPoster = '';
  try {
    localPoster = await cacheThumbnail(gif);
  } catch (err) {
    console.warn(`Could not cache Redgifs thumbnail for ${gif.id}:`, err.message || err);
  }

  items.push({
    id: gif.id,
    url: gif.urls?.html || (gif.id ? `https://www.redgifs.com/watch/${gif.id}` : ''),
    embed: gif.urls?.iframe || (gif.id ? `https://www.redgifs.com/ifr/${gif.id}` : ''),
    poster: gif.urls?.poster || gif.urls?.thumbnail || '',
    thumbnail: gif.urls?.thumbnail || gif.urls?.poster || '',
    localPoster,
    duration: gif.duration || 0,
    width: gif.width || 0,
    height: gif.height || 0,
    hasAudio: Boolean(gif.hasAudio)
  });
}

const payload = {
  updated: new Date().toISOString().slice(0, 10),
  sourceUser: user,
  sourceUrl: `https://www.redgifs.com/users/${user}`,
  items
};

await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(`Wrote ${items.length} Redgifs previews to ${outFile}`);
