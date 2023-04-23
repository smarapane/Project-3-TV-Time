d3.csv("data/transcript_data.csv")
.then(_data => {

  data = _data;

  var barData = [];
  var characterList = ['Fry', 'Leela', 'Hermes', 'Zoidberg', 'Scruffy', 'Zapp' ,'Zapp Brannigan'];
  var barData = getCharacterData(characterList, data, barData);
  console.log("BarData");
  console.log(barData);

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


// function getCharacterData(characterList, data, barData) {
//   for (let i = 0; i < characterList.length; i++) {
//     let charData = prepBarData(characterList[i], data);
//     barData.push(charData);
//   }
//   return barData;
// }

// function prepBarData(character, data) {
//   var characterLines = [];

  
//   data.forEach(d => {
//     if (d['character'] == character) {
//       characterLines.push(d);
//     }
//   })

//   return characterLines;
// }

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
