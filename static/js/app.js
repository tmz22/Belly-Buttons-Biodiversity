 //Dropdown
 var dropdown = d3.select("#selDataset")

// Import Data
d3.json("samples.json").then(function (data) {
  console.log(data);

  // Loop using forEach
  data.names.forEach(entry =>{
      
      // Append Value Into Dropdown
      dropdown.append('option')
      .attr('value', entry)
      .text(entry)
      .property('value')
  })
      
   // Update Page on New Input
  function updatePage(meta, samp) {
      
      // Sample Metadata
      var sampData = d3.select(`#sample-metadata`)

      // Clear HTML
      sampData.html("")

      Object.entries(meta).forEach(function([key, value]) {
          
          // Append Value Into Paragraph Tag
          sampData.append('p').text(`${key}:${value}`)
          
      })

      // Create X Values and Y Values
      var xBar = samp.sample_values.slice(0,10).reverse()
      
      var yBar = samp.otu_ids.slice(0,10).reverse().map(d => "OTU " + d)
      
      // Create Text Values
      var textBar = samp.otu_labels.slice(0,10).reverse()

      // Bar Chart Data
      var barData = {
         x: xBar,
         y: yBar,
         text: textBar,
         marker: {
             color: 'rgba(78,42,132,1)'},
             type:  'bar',
             orientation: 'h'          
      }
      // Bar Chart Layout
      var barLayout = {
          yaxis:{
              autorange: true,
              type: 'category',
          },
          margin: {
              l: 100,
              r: 100,
              t: 0,
              b: 50
            }
      }

      // Plot Bar Chart 
      Plotly.newPlot("bar", [barData], barLayout, responsive = true)

      // Bubble Chart Data
      var bubbleData = [{
          x: samp.otu_ids,
          y: samp.sample_values,
          mode: "markers",
          marker: {size: samp.sample_values, colorscale: 'Earth', color: samp.otu_ids},
          text: samp.otu_labels
      }]
      // Bubble Chart Layout 
      var bubbleLayout = {
          xaxis: {title:"OTU ID"},
          
      }
      // Plot Bubble Chart 
      Plotly.newPlot("bubble", bubbleData, bubbleLayout, responsive = true)

      // Create Gauge Chart Data
      var gaugeData = [
          {value: parseFloat(meta.wfreq),
          title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
          rotation: 90,
          type: "indicator",
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                  bar: { color: "black" },
              }
              }
      ]

      // Create Gauge Chart Layout
      var gaugeLayout = { width: 500, height: 400}

      // Plot Gauge Chart
      Plotly.newPlot('gauge', gaugeData, gaugeLayout, responsive = true)

  }

  //Function To Set Starting Page
  function init(){

      // Get First Metadata
      var firstMetadata = data.metadata[0]
      
      // Get First Sample
      var firstSample = data.samples[0]
      
      // Set Starting Page
      updatePage(firstMetadata, firstSample)

      // Update Page on New Input
      d3.selectAll("#selDataset").on("change", function(){
          
          // Update Metadata 
          var meta = data.metadata.find(d => d.id == this.value)
          
          // Update Sample
          var samp = data.samples.find(d => d.id == this.value)
          
          // Deploy Function
          updatePage(meta, samp)
      })
  }
  // Deploy Function
  init()
})