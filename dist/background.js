const cfgLocalUrl = chrome.runtime.getURL('./assets/config/cfg.json');

fetch(cfgLocalUrl)
  .then((response) => response.json())
  .then((data) => {
    chrome.storage.local.set({ devmode: data.dev });
    chrome.storage.local.set({ currentDexGen: data.currentDexGen });
  });

chrome.storage.local.get('devmode', function (result) {
  if (result.devmode == 1) {
    // Do if devmode is enabled
    console.log(
      '🟣 Developer mode is active, some extra debug information might be available.'
    );
  }
});

var manifestData = chrome.runtime.getManifest();

console.log(`🟢 Online on the service worker side. (v${manifestData.version})`);
