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
  /* SEREBII BLOCK */
  if (url == 'https://www.serebii.net/pokedex/') {
  } else if (url.includes('serebii.net/pokedex/')) {
    gen = 1;
    icon();
  }
}

function fetchSerebii(url, gen) {
  var npkmn = 0;

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
function icon() {
  const icon_el = document.createElement('img');
  icon_el.className = 'icon';
  icon_el.src = chrome.runtime.getURL('./assets/img/mdex-default.png');
  document.body.appendChild(icon_el);

  icon_el.addEventListener('click', function () {
    icon_el.parentNode.removeChild(icon_el);
    fetchSerebii(url, gen);
  });
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
  //Font usada no overlay
  const l1 = document.createElement('link');
  l1.rel = 'preconnect';
  l1.href = 'https://fonts.googleapis.com';
  const l2 = document.createElement('link');
  l2.rel = 'preconnect';
  l2.href = 'https://fonts.gstatic.com';
  l2.crossOrigin;
  const l3 = document.createElement('link');
  l3.rel = 'stylesheet';
  l3.href =
    'https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';

  document.head.appendChild(l1);
  document.head.appendChild(l2);
  document.head.appendChild(l3);

  const element = document.createElement('div');
  element.className = 'overlay';

  //Close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close_btn';
  closeButton.innerText = 'X';
  closeButton.onclick = function () {
    element.parentNode.removeChild(element);
    icon();
  };
  element.appendChild(closeButton);

  //Header
  const headerElement = document.createElement('div');
  headerElement.className = 'ov-header';

  //Logo
  const logo = document.createElement('img');
  logo.className = 'imgM';
  logo.src = chrome.runtime.getURL('./assets/img/mdex-yt.png');
  logo.addEventListener('click', function () {
    window.open('https://www.youtube.com/@MrPokedex', '_blank');
  });
  headerElement.appendChild(logo);

  //Titulo Header
  const Theader = document.createElement('h3');
  Theader.innerText = 'Mr. Pokédex';

  headerElement.appendChild(Theader);

  element.appendChild(headerElement); //Fim Header

  //Container PKInfo
  const PKInfoElement = document.createElement('div');
  PKInfoElement.className = 'pkinfo';

  //PK Icon
  const image = document.createElement('img');
  image.src = 'https://www.serebii.net/pokedex/icon/plant.png';
  PKInfoElement.appendChild(image);

  //PK Number
  const pkNumber = document.createElement('p');
  pkNumber.innerText = `#${natID}`;
  PKInfoElement.appendChild(pkNumber);

  //PK Nome
  const pkNome = document.createElement('p');
  pkNome.innerHTML = `${engnamePK}`;
  PKInfoElement.appendChild(pkNome);

  element.appendChild(PKInfoElement); //Fim PKInfo

  // create the container element for the video
  const videoContainer = document.createElement('div');
  videoContainer.className = 'vContainer';

  // create the iframe element for the video
  const videoFrame = document.createElement('iframe');
  videoFrame.className = 'vFrame';
  videoFrame.src = `https://www.youtube.com/embed/${vidID}`;
  videoFrame.allowFullscreen = true;

  // add the iframe element to the container element
  videoContainer.appendChild(videoFrame);

  // add the video container to the page
  element.appendChild(videoContainer);

  document.body.appendChild(element);
}
