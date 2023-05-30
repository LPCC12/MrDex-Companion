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

    fetch('https://luisccosta12.social/MDexDB/g1/main.json')
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
            data[npkmn - 1].img,
            data[npkmn - 1].game,
            data[npkmn - 1].link,
            data[npkmn - 1].dexgen,
            data[npkmn - 1].appendix,
            gen,
            data[npkmn - 1].id
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
  icon_el.src = chrome.runtime.getURL('./assets/img/mdex-clickme.png');
  document.body.appendChild(icon_el);

  icon_el.addEventListener('click', function () {
    icon_el.parentNode.removeChild(icon_el);
    fetchSerebii(url, gen);
  });
}

function overlay(
  numPK,
  engnamePK,
  imgPK,
  gamesPK,
  vidID,
  dexGEN,
  appendix,
  pkGEN,
  natID
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
  headerElement.addEventListener('click', function () {
    window.open('https://www.youtube.com/@MrPokedex', '_blank');
  });

  //Logo
  const logo = document.createElement('img');
  logo.className = 'imgM';
  logo.src = chrome.runtime.getURL('./assets/img/mdex-default.png');

  headerElement.appendChild(logo);

  //Titulo Header
  const Theader = document.createElement('h3');
  Theader.style = 'font-size: 25px';
  Theader.innerText = 'Mr. Pokédex';

  headerElement.appendChild(Theader);

  element.appendChild(headerElement); //Fim Header

  //Container PKInfo
  const PKInfoElement = document.createElement('div');
  PKInfoElement.className = 'pkinfo';

  //PK Icon
  const image = document.createElement('img');
  image.src = `https://luisccosta12.social/MDexDB/g1/img/${imgPK}.png`;
  PKInfoElement.appendChild(image);

  //PK Number
  const pkNumber = document.createElement('p');
  pkNumber.className = 'cenP';
  pkNumber.innerText = `#${natID}`;
  PKInfoElement.appendChild(pkNumber);

  //PK Nome
  const pkNome = document.createElement('p');
  pkNome.className = 'cenP';
  pkNome.innerHTML = `${engnamePK}`;
  PKInfoElement.appendChild(pkNome);

  //PK Games Available
  var R = 0;
  var B = 0;
  var Y = 0;

  if (gamesPK.includes('R')) R = 1;
  if (gamesPK.includes('B')) B = 1;
  if (gamesPK.includes('Y')) Y = 1;

  if (R == 1) {
    const pkRED = document.createElement('img');
    pkRED.src = chrome.runtime.getURL(`./assets/img/gameboy.svg`);
    pkRED.className = 'gbRED';

    PKInfoElement.appendChild(pkRED);
  }

  if (B == 1) {
    const pkBLUE = document.createElement('img');
    pkBLUE.src = chrome.runtime.getURL(`./assets/img/gameboy.svg`);
    pkBLUE.className = 'gbBLUE';

    PKInfoElement.appendChild(pkBLUE);
  }

  if (Y == 1) {
    const pkYLW = document.createElement('img');
    pkYLW.src = chrome.runtime.getURL(`./assets/img/gameboy.svg`);
    pkYLW.className = 'gbYELLOW';

    PKInfoElement.appendChild(pkYLW);
  }

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

  // Appendix Group
  const appendixG = document.createElement('div');
  appendixG.className = 'apd';

  let dexgen;
  let link;
  let icon;
  let desc;

  fetchAPX(appendix)
    .then((result) => {
      // Access the values returned by the function
      dexgen = result.dexgen;
      link = result.link;
      icon = result.icon;
      desc = result.description;

      //Appendix Icon
      const apxIcon = document.createElement('img');
      if (!icon)
        apxIcon.src = `https://luisccosta12.social/MDexDB/icons/null.png`;
      else apxIcon.src = `https://luisccosta12.social/MDexDB/icons/${icon}.png`;
      appendixG.appendChild(apxIcon);

      // Appendix Description
      const apxDesc = document.createElement('p');
      apxDesc.innerHTML = desc;
      appendixG.appendChild(apxDesc);

      if (link) {
        //Appendix Link
        const apxLink = document.createElement('img');
        apxLink.src =
          'https://img.icons8.com/material-outlined/24/link--v1.png';
        apxLink.className = 'iconAPX';
        apxLink.addEventListener('click', function () {
          window.open(`https://youtu.be/${link}`, '_blank');
        });
        appendixG.appendChild(apxLink);
      }
    })
    .catch((error) => {
      console.log(`⚠️ An error occurred: ${error}`);
    });

  element.appendChild(appendixG);

  // Further processing with the properties...
  document.body.appendChild(element);
}

function fetchAPX(codename) {
  return new Promise((resolve, reject) => {
    fetch('https://luisccosta12.social/MDexDB/g1/appendix.json')
      .then((response) => response.json())
      .then((data) => {
        let foundItem = data.find((item) => item.codename === codename);

        if (foundItem) {
          let valid = '🛑';

          if (foundItem.description != null) valid = '🟢';

          if (dev) {
            console.log(
              `🟣 Appendix: valid(${valid}) | dexgen(${foundItem.dexgen}) | link(${foundItem.link}) | icon(${foundItem.icon})`
            );
          }

          resolve({
            dexgen: foundItem.dexgen,
            link: foundItem.link,
            icon: foundItem.icon,
            description: foundItem.description,
          });
        } else {
          reject(`Item with codename "${codename}" not found.`);
        }
      })
      .catch((error) => {
        reject(`An error occurred: ${error}`);
      });
  });
}
