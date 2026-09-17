/**
 * Fetch public (free) Patreon posts at build/deploy time.
 * Writes data/free-posts.json for the static site.
 *
 * Campaign: https://www.patreon.com/futaontop (id 11373558)
 * Browser fetch is blocked by CORS - this must run in CI / Node.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'free-posts.json');

const CAMPAIGN_ID = '11373558';
const PATREON_URL = 'https://www.patreon.com/futaontop';
const MAX_POSTS = 12;
const EXCERPT_LEN = 160;

function walkText(node, parts) {
 if (!node || typeof node !== 'object') return;
 if (node.type === 'text' && node.text) parts.push(node.text);
 const kids = node.content;
 if (Array.isArray(kids)) kids.forEach((k) => walkText(k, parts));
}

function excerptFromPost(attrs) {
 if (attrs.teaser_text && String(attrs.teaser_text).trim()) {
 return cleanExcerpt(attrs.teaser_text);
 }
 if (attrs.content && typeof attrs.content === 'string') {
 const stripped = attrs.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
 if (stripped) return cleanExcerpt(stripped);
 }
 if (attrs.content_json_string) {
 try {
 const doc = JSON.parse(attrs.content_json_string);
 const parts = [];
 walkText(doc, parts);
 const joined = parts.join(' ').replace(/\s+/g, ' ').trim();
 if (joined) return cleanExcerpt(joined);
 } catch {
 /* ignore */
 }
 }
 return '';
}

function cleanExcerpt(text) {
 let t = String(text)
.replace(/\s+/g, ' ')
.replace(/https?:\/\/\S+/g, ' ')
.replace(/\s+/g, ' ')
.trim();

 // Drop leading CTA noise ("¬‡ï¸ Download HERE:", "ðŸ'‰ PLAY ON STEAM ðŸ'ˆ", etc.)
 t = t
.replace(/^.*?Download HERE:?\s*/i, '')
.replace(/^.*?PLAY ON STEAM\b(?:\s*.\s*)?/i, '')
.replace(/^[^\p{L}\p{N}"""']+/u, '')
.trim();

 if (t.length <= EXCERPT_LEN) return t;
 return t.slice(0, EXCERPT_LEN - 1).replace(/\s+\S*$/, '') + '...';
}

function pickImage(attrs) {
 const img = attrs.image || {};
 // Prefer aspect-ratio-preserving Patreon URLs. Square thumbs make 16:9 cards look over-zoomed.
 return (
 img.thumb_url ||
 img.url ||
 img.large_url ||
 img.thumb_square_large_url ||
 img.thumb_square_url ||
 null
 );
}

function isFree(attrs) {
 if (attrs.min_cents_pledged_to_view === 0) return true;
 if (attrs.is_public === true) return true;
 return false;
}

async function fetchPosts() {
 const url =
 `https://www.patreon.com/api/posts` +
 `?filter%5Bcampaign_id%5D=${CAMPAIGN_ID}` +
 `&sort=-published_at` +
 `&json-api-version=1.0` +
 `&page%5Bcount%5D=30`;

 const res = await fetch(url, {
 headers: {
 Accept: 'application/vnd.api+json',
 'User-Agent': 'FoTWebsiteBot/1.0 (+https://futaontop.com; free-posts mirror)'
 }
 });

 if (!res.ok) {
 throw new Error(`Patreon API HTTP ${res.status}`);
 }

 const json = await res.json();
 const rows = Array.isArray(json.data) ? json.data : [];

 const posts = rows
.filter((row) => row && row.attributes && isFree(row.attributes))
.slice(0, MAX_POSTS)
.map((row) => {
 const a = row.attributes;
 const title = (a.title || 'Patreon post').trim();
 const postUrl = a.url || `${PATREON_URL}/posts/${row.id}`;
 const date = (a.published_at || a.created_at || '').slice(0, 10);
 const image = pickImage(a);
 const excerpt = excerptFromPost(a);

 return {
 id: String(row.id),
 title,
 url: postUrl,
 date,
 image,
 excerpt,
 tag: 'Free',
 cta: 'Read more'
 };
 });

 return {
 updated: new Date().toISOString().slice(0, 10),
 source: 'patreon-api',
 campaignId: CAMPAIGN_ID,
 patreonUrl: PATREON_URL,
 posts
 };
}

function fallbackPayload(errMsg) {
 let existing = null;
 try {
 existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));
 } catch {
 /* none */
 }

 if (existing && Array.isArray(existing.posts) && existing.posts.length) {
 return {
...existing,
 updated: existing.updated || new Date().toISOString().slice(0, 10),
 source: existing.source || 'cache',
 fetchError: errMsg,
 patreonUrl: PATREON_URL
 };
 }

 return {
 updated: new Date().toISOString().slice(0, 10),
 source: 'fallback',
 fetchError: errMsg,
 patreonUrl: PATREON_URL,
 posts: [
 {
 id: 'fallback-home',
 title: 'Free posts on Patreon',
 url: PATREON_URL,
 date: '',
 image: null,
 excerpt: 'Public drops and free samples live on Patreon. Support unlocks full chapter downloads and extras.',
 tag: 'Free',
 cta: 'Open Patreon'
 }
 ]
 };
}

async function main() {
 fs.mkdirSync(path.dirname(OUT), { recursive: true });

 let payload;
 try {
 payload = await fetchPosts();
 console.log(`Fetched ${payload.posts.length} free posts`);
 } catch (err) {
 console.error('Patreon fetch failed:', err.message || err);
 payload = fallbackPayload(String(err.message || err));
 console.log(`Using fallback/cache (${payload.posts.length} posts)`);
 }

 fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf8');
 console.log('Wrote', OUT);
}

main();

