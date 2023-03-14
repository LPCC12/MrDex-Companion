//This Code Triggers when visiting any url with https://www.serebii.net/* or https://bulbapedia.bulbagarden.net/wiki/*

let mon;
let gen = 4456496; //Gen 0 = various generations available. Default value means not defined
let place;
let url = location.href;

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

      const localurl = chrome.runtime.getURL('./assets/db/g1/main.json');

      fetch(localurl)
        .then((response) => response.json())
        .then((data) => {
          var temp = npkmn.replace('0', '');
          console.log(
            `ℹ️ Fetched a pkmn id ${
              data[temp - 1].id
            } -> video https://youtu.be/${data[temp - 1].link}.`
          );
        });
    } catch (error) {
      console.log(`⚠️ An error occurred: ${error}`);
    }
  }

  return npkmn;
}
