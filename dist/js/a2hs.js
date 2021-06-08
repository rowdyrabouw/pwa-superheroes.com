let deferredPrompt;
const btnInstall = document.getElementById("btnInstall");

window.addEventListener("beforeinstallprompt", event => {
  console.log("beforeinstallprompt fired");
  // prevent showing dialog
  event.preventDefault();
  deferredPrompt = event;
  // show button to install PWA
  btnInstall.classList.add("show");
  return false;
});

btnInstall.addEventListener("click", () => {
  if (deferredPrompt) {
    // show native dialog
    deferredPrompt.prompt(); // act on user choice
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === "dismissed") {
        console.log("User cancelled installation");
      } else {
        console.log("User added to home screen");
        // hide button to install PWA
        btnInstall.classList.remove("show");
        // reset variable
        deferredPrompt = null;
      }
      // save choice to Analytics
    });
  }
});
