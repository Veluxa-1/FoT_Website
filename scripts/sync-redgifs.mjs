import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const user = process.env.REDGIFS_USER || 'veluxa';
const count = Number(process.env.REDGIFS_COUNT || 6);
const outFile = resolve(process.env.REDGIFS_OUT || 'data/redgifs.json');

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
api.searchParams.set('count', String(count));
api.searchParams.set('type', 'g');

const data = await readJson(api, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const gifs = Array.isArray(data.gifs) ? data.gifs : [];
const items = gifs.map((gif) => ({
  id: gif.id,
  url: gif.urls?.html || (gif.id ? `https://www.redgifs.com/watch/${gif.id}` : ''),
  embed: gif.urls?.iframe || (gif.id ? `https://www.redgifs.com/ifr/${gif.id}` : ''),
  poster: gif.urls?.poster || gif.urls?.thumbnail || '',
  thumbnail: gif.urls?.thumbnail || gif.urls?.poster || '',
  duration: gif.duration || 0,
  width: gif.width || 0,
  height: gif.height || 0,
  hasAudio: Boolean(gif.hasAudio)
}));

const payload = {
  updated: new Date().toISOString().slice(0, 10),
  sourceUser: user,
  sourceUrl: `https://www.redgifs.com/users/${user}`,
  items
};

await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(`Wrote ${items.length} Redgifs previews to ${outFile}`);
