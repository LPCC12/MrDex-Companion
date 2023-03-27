//This Code Triggers when visiting any url with https://www.serebii.net/* or https://bulbapedia.bulbagarden.net/wiki/*

let mon;
let gen = 4456496; //Gen 0 = various generations available. Default value means not defined
let place;
let url = location.href;
let dev;

chrome.storage.local.get('devmode', function (result) {
  dev = result.devmode;
});

if (!url) {
  console.log('⚠️ Unable to get a url from the current session.');
} else if (url.includes('serebii.net')) {
  fetchSerebii(url);
}

function fetchSerebii(url) {
  var npkmn = 0;

  if (url.includes('serebii.net/pokedex/')) {
    gen = 1;
    //Default pages don't return a valid pokémon
    if (url == 'https://www.serebii.net/pokedex/') return;

    try {
      npkmn = url.replace('https://www.serebii.net/pokedex/', '');
      npkmn = npkmn.replace('.shtml', '');

      const g1localurl = chrome.runtime.getURL('./assets/db/g1/main.json');

      fetch(g1localurl)
        .then((response) => response.json())
        .then((data) => {
          if (!data[npkmn - 1].link) {
            console.log('🛑 This Pokémon did not return a video');
          } else {
            console.log(
              `⚪ Fetched a video: https://youtu.be/${data[npkmn - 1].link}`
            );
          }

          if (dev) {
            console.log(
              `🟣 Pokémon:${data[npkmn - 1].name.english} Gen:${gen} ID:${
                data[npkmn - 1].id
              } DGen:${data[npkmn - 1].dexgen} Appendix:${
                data[npkmn - 1].appendix
              } Games: ${data[npkmn - 1].game}`
            );
          }
        });
    } catch (error) {
      console.log(`⚠️ An error occurred: ${error}`);
    }
  }

  return npkmn;
}
