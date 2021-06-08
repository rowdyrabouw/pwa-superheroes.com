importScripts("idb.js");
importScripts("utils.js");

const DYNAMIC_CACHE = "dynamic-v1";
const STATIC_CACHE = "static-v8";
const STATIC_FILES = [
  "/",
  "index.html",
  "offline.html",
  "css/app.css",
  "idb.js",
  "utils.js",
  "fonts/exo2.woff2",
  "js/app.js",
  "js/a2hs.js",
  "js/api.js",
  "img/pwa.svg",
  "favicon.png",
  "manifest.json",
  "manifest-icon-192.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      cache.addAll(STATIC_FILES);
    })
  );
});

self.addEventListener("fetch", event => {
  if (event.request.url.indexOf(API_URL) > -1) {
    event.respondWith(
      fetch(event.request).then(res => {
        const clonedRes = res.clone();
        clearAllData(DYNAMIC_DB_STORE)
          .then(function() {
            return clonedRes.json();
          })
          .then(data => {
            writeData(DYNAMIC_DB_STORE, data);
          });
        return res;
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(res => {
              return caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(event.request.url, res.clone());
                return res;
              });
            })
            .catch(err => {
              return caches.open(STATIC_CACHE).then(cache => {
                if (event.request.headers.get("accept").includes("text/html")) {
                  return cache.match("/offline.html");
                }
              });
            });
        }
      })
    );
  }
});

self.addEventListener("activate", event => {
  event.waitUntil(
    // will return an array of cache names
    caches.keys().then(keys => {
      // return only when all delete actions resolved a Promise
      return Promise.all(
        // go over all available keys
        keys.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log("[Service Worker] Deleting old caches ...", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("message", event => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
