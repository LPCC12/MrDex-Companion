var manifestData = chrome.runtime.getManifest();

console.log(`Online on the service worker side. (v${manifestData.version})`);
