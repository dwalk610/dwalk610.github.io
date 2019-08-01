
var tableData = data;

// use d3 to reference the tbody in the html file
var tbody = d3.select("tbody");

// Try building the table with a function AND VARIABLE that you can recall
function table_build (info) {
    tbody.selectAll("tr").remove();
    info.forEach((ufoView) => {
    var row = tbody.append("tr");
    Object.entries(ufoView).forEach(([key,value]) => {
        var cell = row.append("td");
        cell.text(value);
    });
});
}

table_build(tableData);
// tbody.selectAll("tr".remove();

// select the submission button
var submit = d3.select("#filter-btn");

// variable to hold the user input
var date_input = d3.select("#datetime");

// define function to filer data on button click
submit.on("click", function() {

    // prevent page refresh
    // d3.event.preventDefault();

    // clear table data and replace table with filtered version
    tbody.selectAll("tr").remove();

    // select the user input
    var date_input = d3.select("#datetime");

    // retreive value property of user input
    var date_val = date_input.property("value");

    // check console log to make sure it's actually grabbing the input
    console.log(date_val);

    // filter data by user selected date
    var byDate = tableData.filter(dates => dates.datetime === date_val);

    // pass filtered data into table_build function to display filtered table on page
    table_build (byDate);

    console.log(byDate);  

});

// function to unfilter table when user changes input form text

date_input.on("input", function() {

    // clear table data and replace table with filtered version
    tbody.selectAll("tr").remove();
    
    // unfilter table back to original data state
    table_build(tableData);

    // set placeholder value back in form

});