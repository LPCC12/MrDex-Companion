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
  icon();
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
function icon() {
  const icon_el = document.createElement('img');
  icon_el.className = 'icon';
  icon_el.src = 'https://i.imgur.com/PIzhW7c.png';
  document.body.appendChild(icon_el);

  icon_el.addEventListener('click', function () {
    icon_el.parentNode.removeChild(icon_el);
    fetchSerebii(url);
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

  //Header
  const headerElement = document.createElement('div');
  headerElement.className = 'ov-header';

  //Logo
  const logo = document.createElement('img');
  logo.className = 'imgM';
  logo.src =
    'https://play-lh.googleusercontent.com/DTzWtkxfnKwFO3ruybY1SKjJQnLYeuK3KmQmwV5OQ3dULr5iXxeEtzBLceultrKTIUTr';
  headerElement.appendChild(logo);

  //Titulo Header
  const Theader = document.createElement('h3');
  Theader.innerText = 'Mr. Pokédex';
  headerElement.appendChild(Theader);

  element.appendChild(headerElement);

  //Close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close_btn';
  closeButton.innerText = 'Close';
  closeButton.onclick = function () {
    element.parentNode.removeChild(element);
    icon();
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

  /*
  const ytBTN = document.createElement('button');
  ytBTN.innerText = 'YT';
  ytBTN.onclick = function () {
    alert('fart');
  };
  element.appendChild(ytBTN);
*/

  document.body.appendChild(element);
}
