//Header
const headerEl = document.getElementById('pop-header');
headerEl.addEventListener('click', function () {
  window.open('https://www.youtube.com/@MrPokedex', '_blank');
});

//Logo
const logoEl = document.getElementById('pop-logo');
logoEl.src = chrome.runtime.getURL('./assets/img/mdex-default.png');
