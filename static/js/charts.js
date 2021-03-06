// declare a global var to pass the weekly washing down to the gauge chart
// otherwise you have to parse out the value again from metadata
// in buildCharts - seems redundant.
var weeklyScrubs = 0.0;

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json("static/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];

    weeklyScrubs = parseFloat(result.wfreq);
    //console.log("In buildMetadata " + weeklyScrubs);

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("static/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samples.filter((sampleObj) => sampleObj.id == sample);
    //console.log(sampleArray);
    //  5. Create a variable that holds the first sample in the array.
    var result = sampleArray[0];
    //console.log(result);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.

    //var yticks =
    sample_values_T10 = sample_values.slice(0, 10).reverse();
    otu_ids_T10 = otu_ids
      .slice(0, 10)
      .reverse()
      .map((id) => "OTU " + id);
    //console.log(otu_ids);
    otu_labels_T10 = otu_labels.slice(0, 10).reverse();

    var trace = {
      x: sample_values_T10,
      y: otu_ids_T10,
      text: otu_labels_T10,
      type: "bar",
      orientation: "h",
    };

    //console.log(trace);

    // 8. Create the trace for the bar chart.
    var barData = [trace];
    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      width: 550,
      height: 400,
      margin: {
        t: 50,
        b: 45,
      },
      font: { family: "Times", size: 14 },
      yaxis: {
        titlefont: {
          family: "Arial, sans-serif",
          size: 10,
          //color: 'lightgrey'
        },
      },
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);

    // Add the Bubble chart
    // Create the bubbleData trace.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth",
        },
      },
    ];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {
        text: "<b>Bacteria Cultures Per Sample</b>",
        font: { family: "Times", size: 30 },
      },
      xaxis: {
        title: {
          text: "OTU ID",
          font: { size: 18 },
        },
      },
      hovermode: "closest",
      height: 600,
      width: 1300,
    };

    // Plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Create the trace for the gauge chart.
    //console.log("Before Gauge " + weeklyScrubs);

    var gaugeData = [
      {
        //domain: { x: [0, 1], y: [0, 1] },
        value: weeklyScrubs,
        title: {
          text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
        },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {
            range: [0, 10],
            tickvals: [0, 2, 4, 6, 8, 10],
            ticktext: ["0", "2", "4", "6", "8", "10"],
          },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "greenyellow" },
            { range: [8, 10], color: "green" },
          ],
        },
      },
    ];

    // Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 475,
      height: 375,
      margin: { t: 0, b: 0 },
      paper_bgcolor: "DeepSkyBlue",
      font: { family: "Times" },
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
