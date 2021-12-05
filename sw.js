//Grabar información de nuestro appshell - corazon de la app
const CACHE_STATIC_NAME = "static-v7";
//Contenido dinámico
const CACHE_DYNAMIC_NAME = "dynamic-v1";

// Librerias que ya no van a cambiar jamas
const CACHE_INMUTABLE_NAME = "inmutable-v1";

const CACHE_DYNAMIC_LIMIT = 50;

function limpiarCache(cacheName, numberItems) {
  caches.open(cacheName).then((cache) => {
    return cache.keys().then((keys) => {
      if (keys.length > numberItems) {
        cache.delete(keys[0]).then(limpiarCache(cacheName, numberItems));
      }
    });
  });
}

self.addEventListener("install", (e) => {
  const cacheProm = caches.open(CACHE_STATIC_NAME).then((cache) => {
    return cache.addAll([
      "/",
      "/index.html",
      "/css/style.css",
      "/img/main.jpg",
      "/js/app.js",
      "/img/no-img.jpg",
      "/pages/offline.html",
    ]);
  });

  const cacheInmutable = caches
    .open(CACHE_INMUTABLE_NAME)
    .then((cache) =>
      cache.add(
        "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
      )
    );

  e.waitUntil(Promise.all([cacheProm, cacheInmutable]));
});

self.addEventListener("activate", (e) => {
  const respuesta = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== CACHE_STATIC_NAME && key.includes("static")) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(respuesta);
});

self.addEventListener("fetch", (e) => {
  //? 2 Cache - WithNetwork Fallback
  //* Intenta leer el cache, si no, intenta ir a la web

  const respuesta = caches.match(e.request).then((res) => {
    if (res) return res;
    //No existe el archivo
    //tengo que ir a la web
    console.log("No existe", e.request.url);

    return fetch(e.request)
      .then((newResp) => {
        caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
          cache.put(e.request, newResp);
          limpiarCache(CACHE_DYNAMIC_NAME, 50);
        });
        return newResp.clone();
      })
      .catch((err) => {
        if (e.request.headers.get("accept").includes("text/html")) {
          return caches.match("/pages/offline.html");
        }
      });
  });
  e.respondWith(respuesta);
});
