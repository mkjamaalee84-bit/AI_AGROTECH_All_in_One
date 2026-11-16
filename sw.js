/* Only public app assets are cached. API calls and user data are never cached. */
'use strict';
const CACHE='ai-agrotech-shell-v1';
const LOCAL=['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png'];
const CDN=['https://cdn.tailwindcss.com/','https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await cache.addAll(LOCAL);
 // Do not fail installation if an optional CDN is unavailable.
 await Promise.allSettled(CDN.map(async url=>{const response=await fetch(url,{mode:'no-cors'});await cache.put(url,response)}));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('ai-agrotech-shell-')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET')return;
 const local=url.origin===self.location.origin&&LOCAL.some(p=>new URL(p,self.registration.scope).pathname===url.pathname);
 const cdn=CDN.includes(url.href);
 if(!local&&!cdn)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(cdn){const hit=await cache.match(request.url);if(hit)return hit;const response=await fetch(request);if(response.ok||response.type==='opaque')await cache.put(request,response.clone());return response}
  try{const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response}
  catch(error){const hit=await cache.match(request);if(hit)return hit;if(request.mode==='navigate'){const page=await cache.match(new URL('./index.html',self.registration.scope));if(page)return page}throw error}
 })());
});
