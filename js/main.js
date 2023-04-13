d3.csv("|","data/transcript_data")
.then(_data => {

  data = _data;

  weekdays = new BarChart(
    {
      parentElement: "#barchart",
      xAxisLabel: "x label",
      yAxisLabel: "y label",
      title: "title",
      xAxisLambda: (d) => {
        return d
      },
      logScale: false,
      containerWidth: 500,
    },
    data
  );


  }).catch(error => console.error(error));
