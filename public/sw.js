/* JesTech Nexus service worker — keeps saved lessons and files usable without internet.
 * - "nexus-saved": things the learner explicitly saved (lessons, PDFs, uploaded files). Never evicted automatically.
 * - "nexus-static": hashed build assets (CSS/JS/fonts), cache-first.
 * - "nexus-pages": last copy of visited pages, used only when the network fails.
 */
const VERSION = "v3";
const STATIC = `nexus-static-${VERSION}`;
const PAGES = `nexus-pages-${VERSION}`;
const SAVED = "nexus-saved";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.add(OFFLINE_URL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SAVED && !k.endsWith(VERSION))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function fromSaved(request) {
  const saved = await caches.open(SAVED);
  return saved.match(request, { ignoreSearch: true });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Uploaded library files live in cloud storage (Vercel Blob): use the saved copy when there is one.
  if (url.hostname.endsWith(".public.blob.vercel-storage.com")) {
    event.respondWith(fromSaved(request).then((hit) => hit || fetch(request)));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // Immutable build assets: cache-first.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(STATIC).then((c) => c.put(request, copy));
            }
            return res;
          }),
      ),
    );
    return;
  }

  // Library files and lesson videos: serve a saved copy first (no data used), else network.
  if (["/files/", "/videos/", "/uploads/"].some((p) => url.pathname.startsWith(p))) {
    event.respondWith(fromSaved(request).then((hit) => hit || fetch(request)));
    return;
  }

  // Pages: network-first, fall back to saved copy, last visited copy, then the offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(async () => (await fromSaved(request)) || (await caches.match(request)) || caches.match(OFFLINE_URL)),
    );
  }
});
