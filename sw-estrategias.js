// const CACHE_NAME = "cache-1";

//Grabar información de nuestro appshell - corazon de la app
const CACHE_STATIC_NAME = "static-v2";
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

self.addEventListener("fetch", (e) => {
  //? 1 Cache - Only
  //* Cuando queremos que toda la app sea servida desde el cache sin ir a la web
  //   e.respondWith(caches.match(e.request));

  //? 2 Cache - WithNetwork Fallback
  //* Intenta leer el cache, si no, intenta ir a la web
  //   const respuesta = caches.match(e.request).then((res) => {
  //     if (res) return res;
  //     //No existe el archivo
  //     //tengo que ir a la web
  //     console.log("No existe", e.request.url);
  //     return fetch(e.request).then((newResp) => {
  //       caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
  //         cache.put(e.request, newResp);
  //         limpiarCache(CACHE_DYNAMIC_NAME, 50);
  //       });
  //       return newResp.clone();
  //     });
  //   });
  //   e.respondWith(respuesta);

  //? 3 Cache - Network with cache Fallback
  //* Primero ve a internet y si existe muestralo, si no
  //* intenta ver si esta en el cache
  //   const resuesta = fetch(e.request)
  //     .then((res) => {
  //       if (!res) return caches.match(e.request);
  //       //   console.log("Fetch", res);
  //       caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
  //         cache.put(e.request, res);
  //         limpiarCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
  //       });
  //       return res.clone();
  //     })
  //     .catch((err) => {
  //       return caches.match(e.request);
  //     });
  //   e.respondWith(resuesta);

  //? 4 Cache with Network Update
  //* Cuando el rendimiento es critico
  //* Nuestras actualizaciones estaran una versión atras de la actual

  //   if (e.request.url.includes("bootstrap")) {
  //     return e.respondWith(caches.match(e.request));
  //   }

  //   const respuesta = caches.open(CACHE_STATIC_NAME).then((cache) => {
  //     fetch(e.request).then((newResponse) => cache.put(e.request, newResponse));
  //     return cache.match(e.request);
  //   });

  //   e.respondWith(respuesta);

  //? 5 - Cache & Network Reace
  //* Lo más rapido que se puede obtener la respuesta

  const respuesta = new Promise((resolve, reject) => {
    let rechazada = false;

    const falloUnaVez = () => {
      if (rechazada) {
        if (/\.(png|jpg)$/i.test(e.request.url)) {
          resolve(caches.match("/img/no-img.jpg"));
        } else {
          reject("No se encontro respuesta");
        }
      } else {
        rechazada = true;
      }
    };

    fetch(e.request)
      .then((res) => (res.ok ? resolve(res) : falloUnaVez()))
      .catch(falloUnaVez);

    caches
      .match(e.request)
      .then((res) => (res ? resolve(res) : falloUnaVez()))
      .catch(falloUnaVez);
  });

  e.respondWith(respuesta);
});
