function init() {
  var selector = d3.select("#selDataset");

  // load the sample file
  d3.json("samples.json").then((data) => {
    console.log(data);

    // pull out the user name/id and build a dynamic dropdown
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });
  });
}

init();

// this function is called when a user selects an id num
function optionChanged(newSample) {
  // console.log(newSample);
  buildMetadata(newSample);
  // buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    // console.log(resultArray);
    var result = resultArray[0];

    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");

    // dump the metadata
    // console.log(result);
    Object.entries(result).forEach(([key, value]) => {
      console.log(key + ": " + value);
      PANEL.append("h6").text(key.toUpperCase() + ": " + value);
    });
  });
}
