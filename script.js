// function setDefaultSelection() {

//   const defaultSeason = Object.keys(jsonData)[0];
//   const defaultEpisodes = jsonData[defaultSeason];

 
//   seasonText.innerHTML = defaultSeason;
//   episodeText.innerHTML = Object.keys(defaultEpisodes)[0];
//   languageText.innerHTML = '';

  
//   populateOptions(jsonData, seasonList, seasonText, episodeList, episodeText);
//   populateOptions(defaultEpisodes, episodeList, episodeText, languageList, languageText);

  
//   seasonSelectBtn.classList.remove('active');
//   episodeSelectBtn.classList.remove('active');
//   languageSelectBtn.classList.remove('active');
// }


// setDefaultSelection();


async function fetchJsonData(filePath) {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching JSON data:', error);
  }
}

function generateOptions(data, list, textElement, clickCallback) {
  list.innerHTML = '';
  for (const key in data) {
    const option = document.createElement('div');
    option.className = 'option';
    const languageName = key.split('#')[1];
    option.textContent = languageName || key;
    list.appendChild(option);

    option.addEventListener('click', function () {
      textElement.innerHTML = languageName || key;
      if (clickCallback) {
        clickCallback(data[key]);
      }
      seasonSelectBtn.classList.remove('active');
      episodeSelectBtn.classList.remove('active');
      languageSelectBtn.classList.remove('active');
    });
  }
}



function populateOptions(data, list, textElement, nextList, nextTextElement) {
  generateOptions(data, list, textElement, function (nextData) {
    if (nextList && nextTextElement) {
      populateOptions(nextData, nextList, nextTextElement, null, null);
    }
  });
}

const seasonSelectBtn = document.getElementById('season-select-btn');
const episodeSelectBtn = document.getElementById('episode-select-btn');
const languageSelectBtn = document.getElementById('language-select-btn');

const seasonText = document.getElementById('season-text');
const episodeText = document.getElementById('episode-text');
const languageText = document.getElementById('language-text');

const seasonList = document.getElementById('season-list');
const episodeList = document.getElementById('episode-list');
const languageList = document.getElementById('language-list');


const jsonFilePath = 'example.json';
fetchJsonData(jsonFilePath).then((jsonData) => {
  seasonSelectBtn.addEventListener('click', function () {
    episodeList.innerHTML = '';
    languageList.innerHTML = '';
    seasonSelectBtn.classList.toggle('active');
    if (seasonSelectBtn.classList.contains('active')) {
      populateOptions(jsonData, seasonList, seasonText, episodeList, episodeText);
    }
  });

  episodeSelectBtn.addEventListener('click', function () {
    languageList.innerHTML = '';
    episodeSelectBtn.classList.toggle('active');
    if (episodeSelectBtn.classList.contains('active')) {
      const selectedSeason = seasonText.textContent;
      const episodes = jsonData[selectedSeason];
      populateOptions(episodes, episodeList, episodeText, languageList, languageText);
    }
  });

  languageSelectBtn.addEventListener('click', function () {
    languageSelectBtn.classList.toggle('active');
    if (languageSelectBtn.classList.contains('active')) {
      const selectedSeason = seasonText.textContent;
      const selectedEpisode = episodeText.textContent;
      const languages = jsonData[selectedSeason][selectedEpisode];
      if (languages) {
        generateOptions(languages, languageList, languageText);
      }
    }
  });
});
