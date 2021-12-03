// if ("serviceWorker" in navigator) {
//   console.log("Podemos usarlo");
// }

if (navigator.serviceWorker) {
  navigator.serviceWorker.register("/sw.js");
}
