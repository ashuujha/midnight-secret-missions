import { createServer } from 'node:http';
import { request as httpsRequest } from 'node:https';

const upstream = new URL(process.env.LACE_PROOF_UPSTREAM ?? 'https://midnight-counter-prover.onrender.com');
if (upstream.protocol !== 'https:') throw new Error('LACE_PROOF_UPSTREAM must use HTTPS.');

const allowedPaths = new Set(['/ready', '/check', '/prove']);
const server = createServer((incoming, outgoing) => {
  const path = new URL(incoming.url ?? '/', 'http://localhost');
  if (!allowedPaths.has(path.pathname)) {
    outgoing.writeHead(404).end();
    return;
  }

  const origin = incoming.headers.origin;
  if (origin) {
    outgoing.setHeader('Access-Control-Allow-Origin', origin);
    outgoing.setHeader('Vary', 'Origin');
    outgoing.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    outgoing.setHeader('Access-Control-Allow-Headers', 'content-type');
  }
  if (incoming.method === 'OPTIONS') {
    outgoing.writeHead(204).end();
    return;
  }
  if (!['GET', 'POST'].includes(incoming.method ?? '')) {
    outgoing.writeHead(405).end();
    return;
  }

  const target = new URL(path.pathname + path.search, upstream);
  const headers = {};
  for (const name of ['content-type', 'content-length']) {
    if (incoming.headers[name]) headers[name] = incoming.headers[name];
  }
  const request = httpsRequest(target, { method: incoming.method, headers }, (response) => {
    if (response.headers['content-type']) outgoing.setHeader('Content-Type', response.headers['content-type']);
    if (response.headers['content-length']) outgoing.setHeader('Content-Length', response.headers['content-length']);
    outgoing.writeHead(response.statusCode ?? 502);
    response.pipe(outgoing);
  });
  request.setTimeout(300_000, () => request.destroy(new Error('Hosted proof service timed out.')));
  request.on('error', (error) => {
    if (!outgoing.headersSent) outgoing.writeHead(502, { 'Content-Type': 'text/plain' });
    outgoing.end(`Hosted proof service unavailable: ${error.message}`);
  });
  incoming.pipe(request);
});

server.listen(6300, '127.0.0.1', () => {
  console.log(`Lace proof bridge listening at http://localhost:6300 → ${upstream.origin}`);
});
