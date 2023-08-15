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
  const autoplayCheckbox = document.getElementById('set_autoplay');
  const muteCheckbox = document.getElementById('set_mute');

  // Save settings to chrome.storage.local
  chrome.storage.local.set({
    autoplaySetting: autoplayCheckbox.checked,
    muteSetting: muteCheckbox.checked,
  });

  alert(
    `Settings saved: Autoplay - ${autoplayCheckbox.checked}, Mute - ${muteCheckbox.checked}`
  );
});

// Fetch settings from chrome.storage.local and update checkboxes
chrome.storage.local.get(['autoplaySetting', 'muteSetting'], function (result) {
  const autoplayCheckbox = document.getElementById('set_autoplay');
  const muteCheckbox = document.getElementById('set_mute');

  // Set the checkboxes based on fetched settings or default values
  autoplayCheckbox.checked =
    result.autoplaySetting !== undefined ? result.autoplaySetting : true;
  muteCheckbox.checked =
    result.muteSetting !== undefined ? result.muteSetting : false;
});
