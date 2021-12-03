self.addEventListener("fetch", (e) => {
  const resp = fetch(e.request).then((resp) => {
    return resp.ok ? resp : fetch("img/main.jpg")
  });

  e.respondWith(resp);
});
