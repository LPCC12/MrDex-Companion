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
            overlay(
              npkmn,
              data[npkmn - 1].name.english,
              gen,
              data[npkmn - 1].dexgen,
              data[npkmn - 1].id,
              data[npkmn - 1].appendix,
              data[npkmn - 1].game,
              data[npkmn - 1].link
            );
          }

          if (dev) {
            console.log(
              `🟣 Pokémon:${data[npkmn - 1].name.english} Gen:${gen} ID:${
                data[npkmn - 1].id
              } DGen:${data[npkmn - 1].dexgen} Appendix:${
                data[npkmn - 1].appendix
              } Games:(${data[npkmn - 1].game})`
            );
          }
        });
    } catch (error) {
      console.log(`⚠️ An error occurred: ${error}`);
    }
  }
  // return npkmn;
}

function overlay(
  numPK,
  engnamePK,
  gameGEN,
  dexGEN,
  natID,
  dexAPD,
  gamesPK,
  vidID
) {
  const element = document.createElement('div');
  element.className = 'noty_overlay';

  //Logo
  const logo = document.createElement('img');
  logo.className = 'img_medium';
  logo.src =
    'https://play-lh.googleusercontent.com/DTzWtkxfnKwFO3ruybY1SKjJQnLYeuK3KmQmwV5OQ3dULr5iXxeEtzBLceultrKTIUTr';
  element.appendChild(logo);

  //Header
  const header = document.createElement('h4');
  header.innerText = 'Mr. Pokédex';
  element.appendChild(header);

  //Close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close_btn';
  closeButton.innerText = 'Close';
  closeButton.onclick = function () {
    element.parentNode.removeChild(element);
  };
  element.appendChild(closeButton);

  //PK Icon
  const image = document.createElement('img');
  image.className = 'img_medium';
  image.src = 'https://www.serebii.net/pokedex/icon/plant.png';
  element.appendChild(image);

  //PK Number
  const pkNumber = document.createElement('p');
  pkNumber.innerText = `#${natID}`;
  element.appendChild(pkNumber);

  //PK Nome
  const pkNome = document.createElement('p');
  pkNome.innerHTML = `${engnamePK}`;
  element.appendChild(pkNome);

  // create the container element for the video
  const videoContainer = document.createElement('div');
  videoContainer.style.width = '100%';
  videoContainer.style.height = '0';
  videoContainer.style.padding = '56.25% 0 0 0'; // 16:9 aspect ratio
  videoContainer.style.position = 'relative';

  // create the iframe element for the video
  const videoFrame = document.createElement('iframe');
  videoFrame.style.width = '100%';
  videoFrame.style.height = '100%';
  videoFrame.style.position = 'absolute';
  videoFrame.style.top = '0';
  videoFrame.style.left = '0';
  videoFrame.src = `https://www.youtube.com/embed/${vidID}`;
  videoFrame.allowFullscreen = true;

  // add the iframe element to the container element
  videoContainer.appendChild(videoFrame);

  // add the video container to the page
  element.appendChild(videoContainer);

  //Visit in Youtube
  const ytBTN = document.createElement('button');
  ytBTN.innerText = 'YT';
  ytBTN.onclick = function () {
    alert('fart');
  };
  element.appendChild(ytBTN);

  /*
  // Create the link
  const link = document.createElement('a');
  link.href = 'https://www.pokemon.com/';
  link.innerText = 'Visit Pokemon Website';
  element.appendChild(link);

  // Create the data container
  const dataContainer = document.createElement('div');
  dataContainer.className = 'data_container';
  element.appendChild(dataContainer);

  // Create the data elements
  const numElement = document.createElement('p');
  numElement.innerText = `Pokemon Number: ${numPK}`;
  dataContainer.appendChild(numElement);

  const engnameElement = document.createElement('p');
  engnameElement.innerText = `English Name: ${engnamePK}`;
  dataContainer.appendChild(engnameElement);

  const gameGENElement = document.createElement('p');
  gameGENElement.innerText = `Game Generation: ${gameGEN}`;
  dataContainer.appendChild(gameGENElement);

  const dexGENElement = document.createElement('p');
  dexGENElement.innerText = `Dex Generation: ${dexGEN}`;
  dataContainer.appendChild(dexGENElement);

  const natIDElement = document.createElement('p');
  natIDElement.innerText = `National ID: ${natID}`;
  dataContainer.appendChild(natIDElement);

  const dexAPDElement = document.createElement('p');
  dexAPDElement.innerText = `Dex Appearance: ${dexAPD}`;
  dataContainer.appendChild(dexAPDElement);

  const gamesPKElement = document.createElement('p');
  gamesPKElement.innerText = `Games: ${gamesPK}`;
  dataContainer.appendChild(gamesPKElement);
  */

  document.body.appendChild(element);
}
