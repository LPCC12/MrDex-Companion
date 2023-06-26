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
  console.log('🟡 Unable to get a url from the current session.');
} else if (url.includes('serebii.net')) {
  /* SEREBII BLOCK */
  place = 'serebii';

  //GEN 1
  if (url.includes('serebii.net/pokedex/')) {
    gen = 1;
    clickme();
  }

  //GEN 2
  if (url.includes('serebii.net/pokedex-gs/')) {
    gen = 2;
    //clickme();
  }
}

function clickme() {
  let iclass = 'icon0';
  let iimg = chrome.runtime.getURL('./assets/img/rotomdex-wide.png');

  //Diferentes icons dependendo da geração.

  switch (gen) {
    case 1:
      iclass = 'icon1';
      iimg = chrome.runtime.getURL('./assets/img/click1.png');
      break;
    default:
      console.warn('🔴 Generation is invalid.');
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
        console.warn('🔴 Place is invalid.');
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
    console.warn(`🔴 ${error}`);
  }

  if (npkmn == 0 && namePKMN == 'NULL') {
    //There is no data so i'm assuming im in a pokédex page. Providing Search Overlay
    console.log(
      `⚪ (${place}) No pk data available. Providing search overlay.`
    );
    overlay('s');
  } else if (npkmn != 0) {
    if (dev) {
      console.log(`🟣 (${place}) Fetching data using number ${npkmn}.`);
    }

    try {
      fetch('https://luisccosta12.social/MDexDB/g1/main.json')
        .then((response) => response.json())
        .then((data) => {
          if (!data[npkmn - 1].link) {
            console.log(
              "⚪ This Pokémon did not return a video, assuming it's not yet available"
            );
            overlay('w');
          } else if (data[npkmn - 1].link == 'unobtainable') {
            console.log('⚪ This Pokémon does not have a video.');
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
      console.log(`🟡 An error occurred: ${error}`);
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

    v - Valid with ALL data
    s - Search overlay. Probably no data.
    w - No video yet.
    e - This Pokémon is unobtainable without cheats or glitches.

  */

  let ov_PKENGNAME = '???';
  let ov_PKIMG = null;
  let ov_PKGAMES = 'null';
  let ov_vidID = null;
  let ov_dexGEN = null;
  let ov_PKAppendix = null;
  let ov_NatID = 0;

  if (mode == 's') {
    alert('Search to be developed');
    return;
  } else if (mode == 'v') {
    ov_PKENGNAME = engnamePK;
    ov_PKIMG = imgPK;
    ov_PKGAMES = gamesPK;
    ov_vidID = vidID;
    ov_dexGEN = dexGEN;
    ov_PKAppendix = appendix;
    ov_NatID = natID;

    console.log('⚪ Data fetched. Creating overlay with all data.');
  } else if (mode == 'e') {
    alert('Unobtainable to be developed');
    return clickme();
  } else if (mode == 'w') {
    alert('WIP to be developed');
    return clickme();
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

  //Theme
  switch (gen) {
    case 1:
      element.className = 'overlay1';
      break;

    case 4456496:
    default:
      element.className = 'overlay0';
      break;
  }

  //Outdated video info
  if (ov_dexGEN != currentDexGen && ov_dexGEN != null) {
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
  image.className = 'pk-icon';
  if (ov_PKIMG == null)
    image.src = `https://img.icons8.com/sf-regular-filled/48/FFFFFF/no-camera.png`;
  else {
    if (gen == 1) {
      image.src = `https://luisccosta12.social/MDexDB/g1/img/${ov_PKIMG}.png`;
    }
  }
  PKInfoElement.appendChild(image);

  //PK National ID
  const pkNumber = document.createElement('p');
  pkNumber.innerText = `#${ov_NatID}`;
  PKInfoElement.appendChild(pkNumber);

  //PK Nome
  const pkNome = document.createElement('p');
  pkNome.innerHTML = `${ov_PKENGNAME}`;
  PKInfoElement.appendChild(pkNome);

  if (ov_PKGAMES != 'null') {
    if (gen == 1) {
      let gbWrapper = document.createElement('div');
      gbWrapper.className = 'gb-wrapper';

      const pkREDImage = document.createElement('img');
      pkREDImage.src =
        'https://luisccosta12.social/MDexDB/origin-mark/GB-R.png';
      pkREDImage.className = 'gb-om';

      gbWrapper.appendChild(pkREDImage);

      if (!ov_PKGAMES.includes('R')) {
        const warningIcon = document.createElement('img');
        warningIcon.src = 'https://img.icons8.com/fluency/48/close-window.png';
        warningIcon.className = 'warningIcon';
        //Might need change
        warningIcon.title =
          'Unavailable in Red Version, trade with another version.';
        pkREDImage.style = 'opacity: 40%';
        gbWrapper.appendChild(warningIcon);
      }

      PKInfoElement.appendChild(gbWrapper); //End Red Version

      gbWrapper = document.createElement('div');
      gbWrapper.className = 'gb-wrapper';

      const pkBlueImage = document.createElement('img');
      pkBlueImage.src =
        'https://luisccosta12.social/MDexDB/origin-mark/GB-B.png';
      pkBlueImage.className = 'gb-om';

      gbWrapper.appendChild(pkBlueImage);

      if (!ov_PKGAMES.includes('B')) {
        const warningIcon = document.createElement('img');
        warningIcon.src = 'https://img.icons8.com/fluency/48/close-window.png';
        warningIcon.className = 'warningIcon';
        //Might need change
        warningIcon.title =
          'Unavailable in Blue Version, trade with another version.';
        pkBlueImage.style = 'opacity: 40%';
        gbWrapper.appendChild(warningIcon);
      }

      PKInfoElement.appendChild(gbWrapper); //End Blue Version

      gbWrapper = document.createElement('div');
      gbWrapper.className = 'gb-wrapper';

      const pkYellowImage = document.createElement('img');
      pkYellowImage.src =
        'https://luisccosta12.social/MDexDB/origin-mark/GB-Y.png';
      pkYellowImage.className = 'gb-om';

      gbWrapper.appendChild(pkYellowImage);

      if (!ov_PKGAMES.includes('Y')) {
        const warningIcon = document.createElement('img');
        warningIcon.src = 'https://img.icons8.com/fluency/48/close-window.png';
        warningIcon.className = 'warningIcon';
        //Might need change
        warningIcon.title =
          'Unavailable in Yellow Version, trade with another version.';
        pkYellowImage.style = 'opacity: 40%';
        gbWrapper.appendChild(warningIcon);
      }

      PKInfoElement.appendChild(gbWrapper); //End Blue Version
    }
  }

  element.appendChild(PKInfoElement); //Fim PKInfo

  // create the container element for the video
  const videoContainer = document.createElement('div');
  videoContainer.className = 'vContainer';

  if (ov_vidID != null) {
    // create the iframe element for the video
    const videoFrame = document.createElement('iframe');
    videoFrame.className = 'vFrame';
    videoFrame.src = `https://www.youtube.com/embed/${ov_vidID}`;
    videoFrame.allowFullscreen = true;

    // add the iframe element to the container element
    videoContainer.appendChild(videoFrame);
  } else {
    const channelFrame = document.createElement('iframe');
    channelFrame.className = 'vFrame';
    if (gen == 1) {
      channelFrame.src =
        'https://www.youtube.com/embed/playlist?list=PLR0rseVv5Fz4eImUR3ReyMrUxy0wSUQ5j';
    } else {
      channelFrame.scr = `https://www.youtube.com/embed/error`;
    }
    videoContainer.appendChild(channelFrame);
  }

  // add the video container to the page
  element.appendChild(videoContainer);

  /*  Appendix Related Code
      This is not working, needs revamp   */

  const appendixG = document.createElement('div');
  appendixG.className = 'apd';

  if (ov_PKAppendix != null) {
    let valid = '🛑';

    fetch('https://luisccosta12.social/MDexDB/g1/appendix.json')
      .then((response) => response.json())
      .then((data) => {
        let foundItems = data.filter((item) =>
          ov_PKAppendix.includes(item.codename)
        );

        if (foundItems.length > 0) {
          valid = '🟢';

          foundItems.forEach((foundItem) => {
            const { dexgen, link, icon, description } = foundItem;

            // Appendix Icon
            const apxIcon = document.createElement('img');
            if (!icon)
              apxIcon.src = `https://luisccosta12.social/MDexDB/icons/null.png`;
            else
              apxIcon.src = `https://luisccosta12.social/MDexDB/icons/${icon}.png`;
            appendixG.appendChild(apxIcon);

            // Appendix Description
            const apxDesc = document.createElement('p');
            apxDesc.innerHTML = description;
            appendixG.appendChild(apxDesc);

            if (link) {
              //Appendix Link
              const apxLink = document.createElement('img');
              apxLink.src =
                'https://img.icons8.com/ios-glyphs/30/FFFFFF/external-link.png';
              apxLink.className = 'iconAPX';
              apxLink.addEventListener('click', function () {
                window.open(`https://youtu.be/${link}`, '_blank');
              });
              appendixG.appendChild(apxLink);
            }

            if (dev) {
              console.log(
                `🟣 Appendix: valid(${valid}) | dexgen(${dexgen}) | link(${link}) | icon(${icon})`
              );
            }
          });
        } else {
          console.warn(`🔴 No items with the given codenames found.`);
        }
      })
      .catch((error) => {
        console.log(`🟡 An error occurred: ${error}`);
      });
  } else {
    const apxDesc = document.createElement('p');
    apxDesc.innerHTML =
      'Oops! I was unable to get a video, might be unreleased or unavailable. Navigate the playlist in the video embed for manual search.';
    appendixG.appendChild(apxDesc);
  }

  element.appendChild(appendixG);
  document.body.appendChild(element);
}
