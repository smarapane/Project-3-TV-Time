active_characters = []

d3.csv("data/transcript_data.csv")
.then(_data => {

  data = _data;

  
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
    data.slice(0, 5)
  );
  bar.updateVis();
  
  var words = prepCloudData("Fry", data);
  cloud = new WordCloud(
    { parentElement: '#wordcloud', },
    words.slice(0, 50)
  ); 
  
  }).catch(error => console.error(error));


function prepCloudData(character, data) {
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

// just get the data points associated with a given character
function prepBarData(character, data) {
  var characterList = [];

  
  data.forEach(d => {
    if (d['character'] == character) {
      characterList.push(d);
    }
  })

  return characterList;
}

function addCharacter() {
  var u = document.getElementById("characters").value;
  if (active_characters.indexOf(u) < 0) {
    active_characters.push(u);
  }
  updateCharacters();
}

function removeCharacter() {
  var u = document.getElementById("characters").value;
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
