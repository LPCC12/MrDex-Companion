//This Code Triggers when visiting any url with https://www.serebii.net/* or https://bulbapedia.bulbagarden.net/wiki/*

let mon;
let gen = 4456496; //Gen 0 = various generations available. Default value means not defined
let place;
let url = location.href;

if (!url) {
  console.log('⚠️ Unable to get a valid url from the current session.');
} else if (url.includes('serebii.net')) {
  if (url.includes('serebii.net/pokedex-gs/')) {
    place = 'serebii_g2';
    gen = 2;
    //TBD
  }

  place = 'serebii_g1';
  gen = 1;
  mon = fetchSerebii(url, gen);
} else if (url.includes('bulbapedia.bulbagarden')) {
  place = 'bulbapedia';
  mon = fetchBulba(url);
} else {
  console.log(
    `⚠️ ContentScript is triggering but not identifying a valid place.`
  );
}

function fetchSerebii(url, gen) {
  //Default pages don't return a valid pokémon
  if (url == 'https://www.serebii.net/pokedex/') return;
  if (url == 'https://www.serebii.net/pokedex-gs/') return;

  var npkmn = 0;
  var pkmn = 'NULL';

  if (url.includes('serebii.net/pokedex/')) {
    if (url == 'https://www.serebii.net/pokedex/') return;

    gen = 1;
    console.log('Visiting a page related to Gen 1.');
    npkmn = url.replace('https://www.serebii.net/pokedex/', '');
    npkmn = npkmn.replace('.shtml', '');

    fetch('https://luisccosta12.social/assets/temp/gen1.json')
      .then((response) => response.json())
      .then((data) => {
        var temp = npkmn.replace('0', '');
        console.log(
          `Just fetched a pkmn w/ id ${
            data[temp - 1].id
          } is video is https://youtu.be/${
            data[temp - 1].forms[0].videos[0].link
          }.`
        );
      });
  }

  return npkmn, gen;
}
function fetchBulba(url) {
  var pkmn = 'NULL';
  if (url.includes('_(Pok%C3%A9mon)')) {
    pkmn = url.replace('https://bulbapedia.bulbagarden.net/wiki/', '');
    pkmn = pkmn.replace('_(Pok%C3%A9mon)', '');
  }
  return pkmn;
}
console.log(`Current Pokémon is: "${mon}" (Obtained via ${place})`);
