// Load the data
d3.csv("https://raw.githubusercontent.com/sl194/HASS-assignment3/main/jan2017onwards_edited.csv", function(d) {
  return {
    town: d.town,
    resale_price: +d.resale_price,
    flat_type: d.flat_type,
    floor_area_sqm: +d.floor_area_sqm,
  };
}).then(function(data) {
    const margin = {top: 10, right: 20, bottom: 30, left: 20};
    const width = window.innerWidth - margin.left - margin.right;
    const height = window.innerHeight - margin.top - margin.bottom;
//        const width = window.innerWidth-10;
//    const height = window.innerHeight;
// Select the buttons
const button1 = d3.select("#room-1");
const button2 = d3.select("#room-2");
const button3 = d3.select("#room-3");
const button4 = d3.select("#room-4");
const button5 = d3.select("#room-5");
const buttonExec = d3.select("#room-exec");
   
// Add event listeners to each button
button1.on("click", function() {
  updateGraph("1 ROOM");
//    updateDomain("1 ROOM");
});
button2.on("click", function() {
  updateGraph("2 ROOM");
//    updateDomain("2 ROOM");
});
button3.on("click", function() {
  updateGraph("3 ROOM");
//    updateDomain("3 ROOM");
});
button4.on("click", function() {
  updateGraph("4 ROOM");
//    updateDomain("4 ROOM");
});
button5.on("click", function() {
  updateGraph("5 ROOM");
//    updateDomain("5 ROOM");
});
buttonExec.on("click", function() {
  updateGraph("EXECUTIVE");
//    updateDomain("EXECUTIVE");
});

    console.log(data);
    console.log(Array.isArray(data));
// Define a function to update the graph based on the selected unit type
function updateGraph(unitType) {
     // Filter the data for the selected unit type
    const filteredData = data.filter(d => d["flat_type"] === unitType);

    // Group the data by town and unit type
    const townData = d3.group(filteredData, d => d.town + "-" + d["flat_type"]);

    // Calculate the average price per square meter for each town and unit type
    const townPrices = Array.from(townData, ([town, data]) => {
      const pricePerSqM = d3.mean(data, d => d["resale_price"] / d["floor_area_sqm"]);
      return { town: town.split("-")[0], unitType: town.split("-")[1], pricePerSqM };
    }).filter(d => d.unitType === unitType);

    // Sort the data by price per square meter
    townPrices.sort(function(a, b) {
      return a.pricePerSqM - b.pricePerSqM;
    });

      const xScale = d3.scaleBand()
    .domain(townPrices.map(d => d.town))
    .range([0, width])
    .padding(0.1);
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(townPrices, d => d.pricePerSqM)])
    .range([height, 0]);
  
    
  // Filter the data by the selected unit type
//  const filteredData = data.filter(function(d) {
//    return d.flat_type === unitType;
//  });
    
    const townCategory = {
  "Woodlands": "North",
  "Yishun": "North",
  "Sembawang": "North",
        
  "Punggol": "North-east",
  "Sengkang": "North-east",
  "Hougang": "North-east",
  "Ang Mo Kio": "North-east",
  "Serangoon": "North-east",
        
  "Pasir Ris": "East",
  "Tampines": "East",
  "Bedok": "East",
        
  "Jurong West": "West",
  "Jurong East": "West",
  "Choa Chu Kang": "West",
  "Bukit Batok": "West",
  "Bukit Panjang": "West",
  "Tengah": "West",
  "Clementi": "West",
        
  "Bishan": "Central",
  "Bukit Merah": "Central",
  "Bukit Timah": "Central",
  "Kallang/Whampoa": "Central",
  "Central Area": "Central",
  "Geylang": "Central",
  "Marine Parade": "Central",
  "Queenstown": "Central",
  "Toa Payoh": "Central",
};
    

  // Select the SVG element and set its size

  const svg = d3.select("#graph");
svg.attr("width", width)
   .attr("height", height);
   
    

  // Set the scales for the x and y axes
//  const xScale = d3.scaleBand()
//    .domain(townPrices.map(d => d.town))
//    .range([0, width])
//    .padding(0.1);
//  const yScale = d3.scaleLinear()
//    .domain([0, d3.max(townPrices, d => d.pricePerSqM)])
//    .range([height, 0]);

    // Define a color scale for each category
const colorScale = d3.scaleOrdinal()
  .domain(["North", "North-east", "East", "West", "Central"])
  .range(["#c7b3e5", "#b3e5e5", "#b3e5b3", "#e5b3b3", "#f2c5a5"]);

// Create the bars for the bar chart
const bars = svg.selectAll("rect")
  .data(townPrices);

// Enter the data for the bars
bars.enter().append("rect")
  .merge(bars)
        .attr("transform", "translate(40,0)")
  .attr("x", d => xScale(d.town))
  .attr("y", d => yScale(d.pricePerSqM))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d.pricePerSqM))
  .attr("fill", d => colorScale(townCategory[d.town]));

  // Remove any bars that are no longer needed
  bars.exit().remove();

  // Add the x-axis
  svg.append("g")
    .attr("transform","translate(40,"+height+")")
      .style("font-size", "8px")
    .call(d3.axisBottom(xScale));

    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Towns in Singapore");
    
    
  // Add the y-axis
  svg.append("g")
    .attr("transform", "translate(40,0)")
    .style("font-size", "8px")
    .call(d3.axisLeft(yScale));
    
//    svg.append("text")
//    .attr("class", "y label")
//    .attr("text-anchor", "end")
//    .attr("y", 0)
//    .attr("dy", "0.6em")
//    .attr("transform", "rotate(-90)")
//    .text(`$ per square meter`);
//    
   

  // Add a title to the graph
//  svg.append("text")
//    .attr("x", width / 2)
//    .attr("y", 40)
//    .attr("text-anchor", "middle")
//    .style("font-size", "36px")
//    .text(`Average prices across different towns in Singapore for ${unitType}`);
     
 
}
    
//function updateXAxis(unitType) {
//       const xScale = d3.scaleBand()
//    .domain(townPrices.map(d => d.town))
//    .range([0, width])
//    .padding(0.1);
//  // Call xAxis again with updated xScale
//  xAxis.call(d3.axisBottom(xScale));
//}

// Initialize the graph with the default unit
//    const defaultUnitType = "1 ROOM";
//    const defaultUnitType = "2 ROOM";
//    const defaultUnitType = "3 ROOM";
//    const defaultUnitType = "4 ROOM";
//    const defaultUnitType = "5 ROOM";
//    const defaultUnitType = "EXECUTIVE";
updateGraph(unitType);
//    svg.exit().remove();

})