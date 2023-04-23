active_characters = []
let wordcloud, phrasecloud;

d3.csv("data/transcript_data.csv")
.then(_data => {

  data = _data;

  var barData = [];
  var characterList = ['Fry', 'Leela', 'Bender', 'Kiff'];
  var barData = getCharacterData(characterList, data, barData);

  //console.log(data.slice(0,5));
  
  bar = new BarChart(
    {
      parentElement: "#barchart",
      xAxisLabel: "x label",
      yAxisLabel: "y label",
      title: "title",
      xAxisLambda: (d) => {
        return d['character'];
      },
      logScale: false,
      containerWidth: 900,
    },
    barData
  );
  bar.updateVis();

  
  var words = prepCloudDataWords("Fry", data);
  wordcloud = new WordCloud(
    { parentElement: '#wordcloud', },
    words.slice(0, 40),
    "Word Cloud"
  ); 

  
  var phrases = prepCloudDataPhrases("Fry", data);
  phrasecloud = new WordCloud(
    { parentElement: '#phrasecloud', },
    phrases.slice(0, 40),
    "Phrase Cloud"
  ); 

  }).catch(error => console.error(error));


function prepCloudDataWords(character, data) {
  var wordDict = {};
  var wordList = [];

  data.forEach(d => {
    if (d['character'] == character) {
      var words = d['line'].split(/[\s,.\?\!]+/);
      words.forEach(word => {
        if (!(stopWordsSet.has(word.toLowerCase()))) {
            if (word in wordDict) {
              wordDict[word] += 1;
            }
            
            else {
              wordDict[word] = 1;
            }
        }
      })
    }
  })

  for (const [key, value] of Object.entries(wordDict)) {
    wordList.push({
        text: key,
        count: value
    });
  }

  return wordList.sort((a, b) => b.count - a.count);
}

function getCharacterData(characterList, data, barData) {
  for (let i = 0; i < characterList.length; i++) {
    data.forEach(d => {
      if (d['character'] == characterList[i]) {
        barData.push(d);
      }
    })
  }
  return barData;
}

function addCharacter() {
  var u = document.getElementById("characters-stack").value;
  if (active_characters.indexOf(u) < 0) {
    active_characters.push(u);
  }
  updateCharacters();
}

function removeCharacter() {
  var u = document.getElementById("characters-stack").value;
  if (active_characters.indexOf(u) > -1) {
    active_characters.pop(u);
  }
  updateCharacters();
}

function clearCharacters() {
  active_characters = [];
  updateCharacters();
}

function updateCharacters() {
  document.getElementById("charlist").innerHTML = "";
  active_characters.forEach((c, i) =>
    document.getElementById("charlist").innerHTML += ("<li>" + c + "</li>"));
}

function updateWordClouds() {
  var character = document.getElementById("characters-cloud").value;

  var words = prepCloudDataWords(character, data);
  wordcloud.updateVis(words.slice(0, 40));

  var phrases = prepCloudDataPhrases(character, data);
  phrasecloud.updateVis(phrases.slice(0, 40));

  d3.select('#cloud-active-character').text('Active Character: ' + character);

}

function prepCloudDataPhrases(character, data) {
  var phraseDict = {};
  var phraseList = [];

  data.forEach(d => {
    if (d['character'] == character) {
      var phrases = d['line'].split(/[!]+/);
      phrases.forEach(phrase => {
          if (phrase.length > 0) {
            if (phrase.toLowerCase().trim() in phraseDict) {
              phraseDict[phrase.toLowerCase().trim()] += 1;
            }
            else {
              phraseDict[phrase.toLowerCase().trim()] = 1;
            }
          }
        }
      )
    }
  })

  for (const [key, value] of Object.entries(phraseDict)) {
    phraseList.push({
        text: key,
        count: value
    });
  }

  return phraseList.sort((a, b) => b.count - a.count);
}
