document.addEventListener('DOMContentLoaded', function () {
  var manifestData = chrome.runtime.getManifest();

  const versionEl = document.getElementById('versionEl');
  versionEl.innerText = `v${manifestData.version}`;

  var notyf = new Notyf({
    duration: 2000,
  });

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
    try {
      // Save settings to chrome.storage.local
      chrome.storage.local.set({
        autoplaySetting: autoplayCheckbox.checked,
        muteSetting: muteCheckbox.checked,
      });

      notyf.success({
        message: '<p style="font-weight: 700;">Settings Saved</p>',
        dismissible: true,
      });
    } catch (error) {
      notyf.error({
        message: '<p style="font-weight: 700;">Something Went Wrong</p>',
        dismissible: true,
      });
      console.log(`🔴 Error saving settings (${error}).`);
    }
  });

  // Fetch settings from chrome.storage.local and update checkboxes
  chrome.storage.local.get(
    ['autoplaySetting', 'muteSetting'],
    function (result) {
      const autoplayCheckbox = document.getElementById('set_autoplay');
      const muteCheckbox = document.getElementById('set_mute');

      // Set the checkboxes based on fetched settings or default values
      autoplayCheckbox.checked =
        result.autoplaySetting !== undefined ? result.autoplaySetting : true;
      muteCheckbox.checked =
        result.muteSetting !== undefined ? result.muteSetting : false;
    }
  );
});
