// CSV HEADERS
// Company_Name,Ticker,Stock_Exchange,Revenue,Net_Income,Net_Prof_Margin,
// ROI,EBITDA,LT_Debt,SH_Equity,Curr_Ratio,Rev_per_Emp
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// Define SVG width and height
var svgWidth = 900;
var svgHeight = 900;

var margin = {
    top: 100,
    right: 40,
    bottom: 100,
    left: 40
  };

var swidth = svgWidth - margin.left - margin.right;
var sheight = svgHeight - margin.top - margin.bottom;

// create SVG wrapper and append SVG group for chart
var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

var chart_group = svg.append("g")
     .attr("transform",`translate(${margin.left},${margin.top})`);

// set initial x and y axis
var initXaxis = "Revenue";
var initYaxis = "Net_Income";

// functions for updating x and y scales
function xScale(companyData, initXaxis) {
    // create x scale
    var x_scale = d3.scaleLinear()
            .domain([d3.min(companyData, d => d[initXaxis]) * 0.8,
                d3.max(companyData, d=> d[initXaxis]) * 1.1
            ])
            .range([0,swidth]);
        console.log(`x scale is ${x_scale}`);
        return x_scale;
}

// update x axis on click
function renderXaxis(newX, xAxis) {
    var bottomAxis = d3.axisBottom(newX);

    xAxis.transition()
    .duration(750)
    .call(bottomAxis);

    return xAxis;
}

// update y scale
function yScale(companyData, initYaxis) {
    // create x scale
    var y_scale = d3.scaleLinear()
            .domain([d3.min(companyData, d => d[initYaxis]) * 0.8,
                d3.max(companyData, d => d[initYaxis]) * 1.1
            ])
            .range([sheight, 0]);
        console.log(`y scale is ${y_scale}`);     
        return y_scale;
}

// update y axis on click
function renderYaxis(newY, yAxis) {
    var leftAxis = d3.axisLeft(newY);

    yAxis.transition()
    .duration(500)
    .call(leftAxis);

    return yAxis;
}

// update circles
function update_cirlces(circlesGroup, newX, initXaxis, newY, initYaxis) {
    circlesGroup.transition()
    .duration(800)
    .attr("cx", d => newX[d[initXaxis]])
    .attr("cy", d => newY[d[initYaxis]]);

    return circlesGroup;
}

// Load data from comp_data.csv file
d3.csv("assets/data/comp_data.csv")
       .then(function(companyData) {
        console.log(companyData);

   // ------------------------------------------------------
   // PARSE FINANCIAL DATA AS NUMBERS
   // ------------------------------------------------------
        companyData.forEach(function(data) {
    // parse data as numbers using "+" operator
        data.Revenue = +data.Revenue;
        data.Net_Income = +data.Net_Income;
        data.Net_Prof_Margin = +data.Net_Prof_Margin;
        data.ROI = +data.ROI;
        data.EBITDA = +data.EBITDA;
        data.LT_Debt = +data.LT_Debt;
        data.SH_Equity = +data.SH_Equity;
        data.Rev_per_Emp = +data.Rev_per_Emp;

        // print out data to check
            console.log(data.Revenue);
            console.log(data.Net_Income);
            console.log(data.Net_Prof_Margin);
            console.log(data.EBITDA);
            console.log(data.LT_Debt);
            console.log(data.SH_Equity);
            console.log(data.Rev_per_Emp);
        });
   // ------------------------------------------------------
   // CREATE X AND Y SCALES FOR CHART
   // ------------------------------------------------------
        // x scale function
        var x_scaleLine = xScale(companyData, initXaxis);

        // y scale function
        var y_scaleLine = yScale(companyData, initYaxis);

        // create initial axis functions
        var bottomAxis = d3.axisBottom(x_scaleLine);
        var leftAxis = d3.axisLeft(y_scaleLine);

        // append x and y axes
        var xAxis = chart_group.append("g")
           .classed("x-axis", true)
           .attr("transform", "translate(20, " + y_scaleLine(0) + " )")
           .call(bottomAxis);

        var yAxis = chart_group.append("g")
        .classed("y-axis", true)
        .attr("transform", "translate(20,0)")
        .call(leftAxis);

        // append initial circles
        var circlesGroup = chart_group.selectAll("circle")
          .data(companyData)
          .enter()
          .append("circle")
          .attr("cx", d => x_scaleLine(d[initXaxis]))
          .attr("cy", d => y_scaleLine(d[initYaxis]))
          .attr("r",10)
          .attr("fill","blue")
          .attr("opacity", ".65");

        // create groups for x axis labels
        var xlabelsGroup = svg.append("g")
           .attr("transform", `translate(${svgWidth / 2} , ${svgHeight - 50})`);

            // revenue label
            var revLabel = xlabelsGroup.append("text")
               .attr("x", 0)
               .attr("y",0)
               .attr("value", "Revenue") 
               .classed("active", true)
               .text("Revenue ($B)");


        // create groups for y axis labels
        var ylabelsGroup = svg.append("g")
           .attr("transform", `translate(0, ${svgHeight / 2})`);

           // net income label
           var net_incomeLabel = ylabelsGroup.append("text")
           .attr("transform", "rotate(-90)")
           .attr("x", 0)
           .attr("y",20)
           .attr("value", "Net Income") 
           .classed("active", true)
           .text("Net Income ($B)");

        var x_scale = d3.scaleLinear()
            .domain([d3.min(companyData, d => d.Revenue) * 0.7,
                d3.max(companyData, d=> d.Revenue) * 1.3
            ])
            .range([0,swidth]);
            console.log(`x scale is ${x_scale}`);
        
        // y scale
        var y_scale = d3. scaleLinear()
            .domain([d3.min(companyData, d => d.Net_Income) * 0.7,
                d3.max(companyData, d => d.Net_Income) * 1.3
            ])
            .range([sheight, 0]);
            console.log(`y scale is ${y_scale}`);        
    });

  

