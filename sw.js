//! Ciclo de vida del SW
self.addEventListener("install", (event) => {
  console.log("SW: Instalando SW");

  //   self.skipWaiting();

  const instalacion = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("SW Instalaciones terminadas");
      self.skipWaiting();
      resolve();
    }, 1);
  });

  event.waitUntil(instalacion);
});

//* Cuando el SW toma el control de la app
self.addEventListener("activate", (event) => {
  //? Borrar cache viejo
  console.log("SW: Activo y listo para controlar la app");
});

//* FETCH: Manejo de peticiones HTTP
self.addEventListener("fetch", (event) => {
  //   //? Aplicar estrategias del caché
  //   console.log("SW:", event.request.url);
  //   if (event.request.url.includes("https://reqres.in/")) {
  //     const resp = new Response(`{ ok: false, msg: 'jajaja'}`);
  //     event.respondWith(resp);
  //   }
});

//* SYNC: Recuperamos conexión a internet
self.addEventListener("sync", (event) => {
  console.log("Tenemos Conexion");
  console.log(event);
  console.log(event.tag);
});

//* PUSH: Manejar las push notifications
self.addEventListener("push", (event) => {
  console.log("Notificacion recibida");
});
