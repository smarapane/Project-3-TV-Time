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
        console.log(d['character']);
        return d['character'];
      },
      logScale: false,
      containerWidth: 900,
    },
    data.slice(0, 5)
  );
  
  bar.updateVis();

  }).catch(error => console.error(error));
