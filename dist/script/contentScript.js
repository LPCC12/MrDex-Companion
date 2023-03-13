//console.log('you visited serebii.net or bulbapedia.bulbagarden.net');

let mon = 'NULL';
let place = 'NULL';
let url = location.href;

if (!url) {
  mon = 'NULL';
  place = 'NULL';
} else if (url.includes('serebii.net')) {
  place = 'Serebii';
  mon = fetchSerebii(url);
} else if (url.includes('bulbapedia.bulbagarden')) {
  place = 'Bulbapedia';
  mon = fetchBulba(url);
}

function fetchSerebii(url) {
  var npkmn = 0;
  var gen = 0;
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

  return npkmn;
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
