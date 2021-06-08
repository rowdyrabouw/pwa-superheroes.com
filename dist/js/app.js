let newWorker;

function showUpdateBar() {
  let snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
}

document.getElementById("snackbar").addEventListener("click", () => {
  newWorker.postMessage({ action: "skipWaiting" });
});

// register your Service Worker
navigator.serviceWorker
  .register("/sw.js")
  .then(reg => {
    reg.addEventListener("updatefound", () => {
      newWorker = reg.installing;
      newWorker.addEventListener("statechange", () => {
        switch (newWorker.state) {
          case "installed":
            if (navigator.serviceWorker.controller) {
              showUpdateBar();
            }
            break;
        }
      });
    });
  })
  .catch(err => {
    console.log(err);
  });

navigator.serviceWorker.addEventListener("controllerchange", () => {
  window.location.reload();
});
