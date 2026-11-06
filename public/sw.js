const CACHE_NAME = "tally-v3";
const APP_SHELL = [
  "./",
  "./manifest.webmanifest",
  "./favicon.png",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

const isSameOrigin = (request) =>
  new URL(request.url).origin === self.location.origin;

const isImmutableAsset = (request) =>
  new URL(request.url).pathname.includes("/_next/static/");

const store = (request, response) => {
  if (response.ok && isSameOrigin(request)) {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
  }
  return response;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || !isSameOrigin(request)) return;

  if (isImmutableAsset(request)) {
    event.respondWith(
      caches
        .match(request)
        .then(
          (cached) =>
            cached ||
            fetch(request).then((response) => store(request, response)),
        ),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => store(request, response))
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const shell = await caches.match("./");
          if (shell) return shell;
        }
        return Response.error();
      }),
  );
});
