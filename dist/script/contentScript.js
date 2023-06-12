//This Code Triggers when visiting any url with https://www.serebii.net/* or https://bulbapedia.bulbagarden.net/wiki/*

let npkmn = 0;
let namePKMN = 'NULL';
let gen = 4456496; //Gen 0 = various generations available. Default value means not defined
let place;
let url = location.href;
let dev;
let currentDexGen;

chrome.storage.local.get('devmode', function (result) {
  dev = result.devmode;
  currentDexGen = result.currentDexGen;
});

if (!url) {
  console.log(
    "⚠️ Unable to get a url from the current session. (I'm in a valid page)"
  );
} else if (url.includes('serebii.net')) {
  /* SEREBII BLOCK */
  place = 'serebii';

  //GEN 1
  if (url.includes('serebii.net/pokedex/')) {
    gen = 1;
    clickme();
  }

  //GEN 2
  if (url == 'https://www.serebii.net/pokedex-gs/') {
  } else if (url.includes('serebii.net/pokedex-gs/')) {
    gen = 2;
    //WIP
  }
}

function clickme() {
  let iclass = 'icon0';
  let iimg = chrome.runtime.getURL('./assets/img/mdex-clickme.png');

  //Diferentes icones consuante a geração.

  switch (gen) {
    case 1:
      iimg = 'https://www.serebii.net/scarletviolet/pokemon/new/053.png';
      break;
    default:
      console.log('🛑 Gen is invalid.');
      break;
  }

  const icon_el = document.createElement('img');
  icon_el.className = iclass;
  icon_el.src = iimg;
  document.body.appendChild(icon_el);

  icon_el.addEventListener('click', function () {
    icon_el.parentNode.removeChild(icon_el);
    switch (place) {
      case 'serebii':
        fetchSerebii();
        break;

      default:
        console.log('🛑 Just lost the place somewhere along the way.');
        break;
    }
  });
}

function fetchSerebii() {
  try {
    npkmn = url.replace('https://www.serebii.net/pokedex/', '');
    npkmn = npkmn.replace('.shtml', '');
    if (npkmn === '' || isNaN(npkmn)) {
      npkmn = 0;
    }
  } catch (error) {
    console.log(`🛑 ${error}`);
  }

  if (npkmn == 0 && namePKMN == 'NULL') {
    //There is no data so i'm assuming im in a pokédex page. Providing Search Overlay
    console.log(
      `⚪ I'm in ${place} with no data so i'm providing a search index alternative.`
    );
    overlay('s');
  } else if (npkmn != 0) {
    console.log(
      `🟣 Fetching pokémon data from ${place} using PKMN number ${npkmn}.`
    );

    try {
      fetch('https://luisccosta12.social/MDexDB/g1/main.json')
        .then((response) => response.json())
        .then((data) => {
          if (!data[npkmn - 1].link) {
            console.log('🛑 This Pokémon did not return a video');
            overlay('e');
          } else {
            console.log(
              `⚪ Fetched a video: https://youtu.be/${data[npkmn - 1].link}`
            );
            overlay(
              'v',
              data[npkmn - 1].name.english,
              data[npkmn - 1].img,
              data[npkmn - 1].game,
              data[npkmn - 1].link,
              data[npkmn - 1].dexgen,
              data[npkmn - 1].appendix,
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
}

function overlay(
  mode,
  engnamePK,
  imgPK,
  gamesPK,
  vidID,
  dexGEN,
  appendix,
  natID
) {
  /*
    Modes

    v - Valid with data
    s - Search overlay. Probably no data.
    w - No video yet.
    e - This Pokémon is unobtainable without cheats or glitches.

  */

  if (mode == 's') {
    alert('Search to be developed');
    return;
  }

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
  switch (gen) {
    case 1:
      element.className = 'overlay1';
      break;

    default:
      element.className = 'overlay0';
      break;
  }

  //Outdated video info
  if (dexGEN != currentDexGen) {
    const outdatedInfo = document.createElement('img');
    outdatedInfo.src =
      'https://img.icons8.com/material-rounded/24/FFFFFF/info.png';
    outdatedInfo.className = 'iconDEXGEN';
    outdatedInfo.title =
      'This video is not up to current standards, this means the quality might not be the best or the video is old.';

    element.appendChild(outdatedInfo);
  }

  //Close button
  const closeButton = document.createElement('button');
  closeButton.className = 'close_btn';
  closeButton.innerText = 'X';
  closeButton.onclick = function () {
    element.parentNode.removeChild(element);
    clickme();
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
    pkRED.title = 'Available in Red Version';

    PKInfoElement.appendChild(pkRED);
  }

  if (B == 1) {
    const pkBLUE = document.createElement('img');
    pkBLUE.src = chrome.runtime.getURL(`./assets/img/gameboy.svg`);
    pkBLUE.className = 'gbBLUE';
    pkBLUE.title = 'Available in Blue Version';

    PKInfoElement.appendChild(pkBLUE);
  }

  if (Y == 1) {
    const pkYLW = document.createElement('img');
    pkYLW.src = chrome.runtime.getURL(`./assets/img/gameboy.svg`);
    pkYLW.className = 'gbYELLOW';
    pkYLW.title = 'Available in Yellow Version';

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

  let adexgen;
  let alink;
  let aicon;
  let adesc;

  fetchAPX(appendix)
    .then((result) => {
      // Access the values returned by the function
      adexgen = result.dexgen;
      alink = result.link;
      aicon = result.icon;
      adesc = result.description;

      //Appendix Icon
      const apxIcon = document.createElement('img');
      if (!aicon)
        apxIcon.src = `https://luisccosta12.social/MDexDB/icons/null.png`;
      else
        apxIcon.src = `https://luisccosta12.social/MDexDB/icons/${aicon}.png`;
      appendixG.appendChild(apxIcon);

      // Appendix Description
      const apxDesc = document.createElement('p');
      apxDesc.innerHTML = adesc;
      appendixG.appendChild(apxDesc);

      if (alink) {
        //Appendix Link
        const apxLink = document.createElement('img');
        apxLink.src =
          'https://img.icons8.com/ios-glyphs/30/FFFFFF/external-link.png';
        apxLink.className = 'iconAPX';
        apxLink.addEventListener('click', function () {
          window.open(`https://youtu.be/${alink}`, '_blank');
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
          reject(`🛑 Item with codename "${codename}" not found.`);
        }
      })
      .catch((error) => {
        reject(`An error occurred: ${error}`);
      });
  });
}
