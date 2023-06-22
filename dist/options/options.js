var manifestData = chrome.runtime.getManifest();

const versionEl = document.getElementById('versionEl');
versionEl.innerText = `v${manifestData.version}`;

//Logo
const logoEl = document.getElementById('pop-logo');
logoEl.src = chrome.runtime.getURL('./assets/img/mdex-companion.png');
logoEl.addEventListener('click', function () {
  window.open('https://www.youtube.com/@MrPokedex', '_blank');
});

const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
  /*chrome.storage.local.set({
    timer: 0,
    isRunning: false,
    timeOption: timeOption.value,
  });*/

  alert('Changes have been saved with success.');
});
