// window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000;
// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 945 - margin.left - margin.right,
    height = 1145 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Read data
d3.csv('https://raw.githubusercontent.com/rootseire/survey/main/treemap-data.csv', function (data) {

    // stratify the data: reformatting for d3.js
    var root = d3.stratify()
        .id(function (d) {
            return d.name;
        })   // Name of the entity (column name is name in csv)
        .parentId(function (d) { return d.parent; })   // Name of the parent (column name is parent in csv)
        (data);
    root.sum(function (d) { return +d.value })   // Compute the numeric value for each entity

    // Then d3.treemap computes the position of each element of the hierarchy
    // The coordinates are added to the root object above
    d3.treemap()
        .size([width, height])
        .padding(4)
        (root)

    // use this information to add rectangles:
    svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")


        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "#94C162")
        .attr("class", "label")

        .on("mouseover", function (d) {
            tip.style("opacity", 1)
                .html("Genre: " + d.data.name + "<br/> Number: " + d.value + "<br/>")
                .style("left", (d3.event.pageX - 25) + "px")
                .style("top", (d3.event.pageY - 25) + "px")
        })
        .on("mouseout", function (d) {
            tip.style("opacity", 0)
        });

    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function (d) { return d.x0 + 6 })    // +10 to adjust position (more right)
        .attr("y", function (d) { return d.y0 + 15 })    // +20 to adjust position (lower)
        .attr('dy', 0) // here
        .text(function (d) { return d.data.name + ' (' + d.data.value + ')' })
        .attr("font-size", "15px")
        .attr("fill", "black")
})



// Define the div for the tooltip
var tip = d3.select("#my_dataviz").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
// Add events to circles

d3.selectAll('.label')
    .attr("x", function (t) {
        return Math.max(0, 100 - this.textLength.baseVal.value);
    });



function calcAllBoxWidths() {
    let allBoxWidths = [];
    let allTextWidths = [];

    let allTextElements = [];

    // Getting all of the rectangles's widths
    document.querySelectorAll("rect.label").forEach((rect) => {
        // and append each value an array

        // rect.getAttribute("width") is the box's width
        allBoxWidths.push(parseInt(rect.getAttribute("width")));
    });

    // Then getting all of the <text>'s widths
    document.querySelectorAll("g>text").forEach((text) => {
        // and append each value an array

        // text.getBBox() is the text width
        allTextWidths.push(parseInt(text.getBBox().width));
        allTextElements.push(text);
    });

    // ========= UNCOMMENT ME IF YOU WANT EXTRA INFO ===========
    // console.log('allBoxWidths array list', allBoxWidths)
    // console.log('allTextWidths array list', allTextWidths)
    // console.log('allTextElements array list', allTextElements)
    // ====================

    // We will loop over every box, and then use it's i/iteration value to get the corrisponding textWidth value
    for (let i = 0; i < allBoxWidths.length; i++) {
        let boxWidth = allBoxWidths[i];
        let textWidth = allTextWidths[i];

        let textElement = allTextElements[i];
        
        // ========= UNCOMMENT ME IF YOU WANT EXTRA INFO ===========
        // console.log('boxWidth:', allBoxWidths[i], 'textWidth:', allTextWidths[i])
        // console.log('textElement', allTextElements[i])
        // console.log('if statement is', (allTextWidths[i] >= allBoxWidths[i]))
        // ====================

        // If the text is wider than the box...
        if (allTextWidths[i] >= allBoxWidths[i]) {
            // Truncate it!
            console.log('Found a text element that is too big for their box. Hover the following to see it:', allTextElements[i])
            textElement.innerHTML = (textElement.innerHTML.slice(0, 4) + "...")
        }
    }
}
