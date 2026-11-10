// Offline support: always fetch the newest page from the network (bypassing the HTTP cache), use the cache only offline.
const C='training-v8';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.hostname==='api.github.com')return;
  const same=u.origin===location.origin;
  const req=same?new Request(e.request,{cache:'no-store'}):e.request;
  e.respondWith(fetch(req).then(r=>{if(r.ok&&(r.type==='basic'||r.type==='cors')){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})
    .catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html'))));
});
