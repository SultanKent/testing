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

let selectedOption = null;

function generateOptions(data, list, textElement, clickCallback, prefix = '') {
  for (const key in data) {
    const optionText = prefix + (key.split('#')[1] || key);

    
    const existingOption = Array.from(list.children).find((opt) => opt.textContent === optionText);

    if (existingOption) {
      if (selectedOption === optionText) {
        existingOption.classList.add('selected');
      }

      continue;
    }

    const option = document.createElement('div');
    option.className = 'option';
    option.textContent = optionText;
    list.appendChild(option);

    option.addEventListener('click', function () {
      list.querySelectorAll('.option').forEach(function (opt) {
        opt.classList.remove('selected');
      });

      option.classList.add('selected');

      selectedOption = optionText;

      textElement.innerHTML = optionText;
      if (clickCallback) {
        clickCallback(data[key]);
      }
      seasonSelectBtn.classList.remove('active');
      episodeSelectBtn.classList.remove('active');
      languageSelectBtn.classList.remove('active');
    });
  }
}

function populateOptions(data, list, textElement, nextList, nextTextElement, prefix = '') {
  generateOptions(data, list, textElement, function (nextData) {
    if (nextList && nextTextElement) {
      populateOptions(nextData, nextList, nextTextElement, null, null, prefix);
    }
  }, prefix);
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
    closeOtherSelectMenus(seasonSelectBtn);
    episodeList.innerHTML = '';
    languageList.innerHTML = '';
    seasonSelectBtn.classList.toggle('active');
    if (seasonSelectBtn.classList.contains('active')) {
      populateOptions(jsonData, seasonList, seasonText, episodeList, episodeText, 'Сезон ');
    }
  });

  episodeSelectBtn.addEventListener('click', function () {
    closeOtherSelectMenus(episodeSelectBtn);
    languageList.innerHTML = '';
    episodeSelectBtn.classList.toggle('active');
    if (episodeSelectBtn.classList.contains('active')) {
      const selectedSeason = seasonText.textContent.split(' ')[1];
      const episodes = jsonData[selectedSeason];
      populateOptions(episodes, episodeList, episodeText, languageList, languageText, 'Серия ');
    }
  });

  languageSelectBtn.addEventListener('click', function () {
    closeOtherSelectMenus(languageSelectBtn);
    languageSelectBtn.classList.toggle('active');
    if (languageSelectBtn.classList.contains('active')) {
      const selectedSeason = seasonText.textContent.split(' ')[1];
      const selectedEpisode = episodeText.textContent.split(' ')[1];
      const languages = jsonData[selectedSeason][selectedEpisode];
      if (languages) {
        generateOptions(languages, languageList, languageText);
      }
    }
  });
});

function closeOtherSelectMenus(clickedBtn) {
  const selectBtns = [seasonSelectBtn, episodeSelectBtn, languageSelectBtn];
  selectBtns.forEach((btn) => {
    if (btn !== clickedBtn && btn.classList.contains('active')) {
      btn.classList.remove('active');
    }
  });
}
