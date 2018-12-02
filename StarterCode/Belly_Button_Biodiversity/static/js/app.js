function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
var metaURL = `/metadata/${sample}`
d3.json(metaURL).then(function(response){
  console.log(response);

  var sampleMetaData = d3.select("#sample-metadata")
  sampleMetaData.html("")
  Object.entries(response).forEach(([key, value]) => {
    var p = sampleMetaData.append("p");
    p.text(`${key}: ${value}`);

  });
});
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {
  plotURL = `/samples/${sample}`;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(plotURL).then(function(response){
    console.log(response);

    var otu_ids = response['otu_ids'];
    var sample_values = response['sample_values'];
    var otu_labels = response['otu_labels'];
    var otu_ids_10 = otu_ids.slice(0,10);
    var sample_values_10 = sample_values.slice(0,10);
    var otu_labels_10 = otu_labels.slice(0,10);

    var trace_scatter = { 
      type: "scatter",
      mode: "markers",
      x: otu_ids,
      y: sample_values,
      marker: {size: sample_values,
                color: otu_ids},
      text: otu_labels,
      hoverinfo: "x+y+text",
      textinfo: "none"

    };

    var data_scatter = [trace_scatter];
    var layout = {
      showlegend: false,
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Values"}
    };
    Plotly.newPlot("bubble", data_scatter, layout);

    
    
     

    var trace_pie = {
      type: "pie",
      values: sample_values_10, 
      labels: otu_ids_10, 
      text: otu_labels_10,
      hoverinfo: "label+text+value+percent",
      textinfo: "percent",
    };
    var data_pie = [trace_pie];
    Plotly.newPlot("pie", data_pie);
  });
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

