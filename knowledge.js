// KNAAAAAAAAAAAAAAAAWLEDGE

/*****************************************************************************************************/
/*                                                                                                   */
/*-------------------------------------------- BASICS -----------------------------------------------*/
/*                                                                                                   */
/*****************************************************************************************************/

// Selecting Elements from the DOM
const el = d3.select("p"); // selects the first p-tags
const el = d3.selectAll("p"); // selects all p-tags
const el = d3.select("#my_id"); // selects the Element with the id of "my_id"


// Appending Elements
const svg = d3.select("body").append("svg") // Appends an svg Element to the body


// Transformation Methods (Adding Attributes)
const el = d3.select("body")
          .append("svg")
          .attr("width", 900) // Adding width property
          .attr("height", 900) // Adding height property
          .attr("class", "foo") // Adding a class to the newly appended svg Element
          .text("Hello world!") // Adding Text content inside the svg Element


// Classes and Styles
// Background: By default the class attribute overrides the classes each time a new class is set --> use the .classed() method to set a new class
const el = d3.select("body")
          .append("svg")
          .classed("myclass1", true) // Adding first class to the Element
          .classed("myclass2", true) // Adding a second class to the Element
          .style("color", "blue") // With the style Method css attributes can be appended


// Joining Data to Elements
// 1. Select the Parent Element where the Data should be merged/injected etc.
// 2. Select all Elements that should be merged with the data
// 3. Add the data() Method and enter the Data that should be merged with the Elments
// 4. Use the join() Method to merge the data to the Elements. Inside the Method specify which Elements should be added if there are more datapoints then Elements
//    The Method will automatically add Elements if there are less Elements in the DOM then Datapoints in the Data. It will also remove Elements if there are more Elements then datapoints
// 5. Set the text according to each Datapoint --> use a callback function
const data = [10, 20, 30, 40, 50]

const el = d3.select('ul')
  .selectAll('li')
  .data(data)
  .join("li")
  .text(d => d)


// Enter, Update and Exit function (manual approach to the join() Method)
// Further manipulation can be achived by using the Enter, Update and Exit functions --> More information in the video "Enter, Update, and Exit"
const data = [10, 20, 30, 40, 50]

const el = d3.select('ul')
  .selectAll('li')
  .data(data)
  .join(
    enter => {
      return enter.append('li')
        .style('color', 'purple')
    },
    update => update.style('color', 'green'),
    exit => exit.remove()
  )
  .text(d => d)

el.enter()
  .append('li')
  .text(d => d)

el.exit().remove()


// CSV Requests with D3
async function getData() {
  const data = await d3.csv("path-to-csv-file");
}

// JSON Requests with D3
async function getData() {
  const data = await d3.json("path-to-json-file");
}


/*****************************************************************************************************/
/*                                                                                                   */
/*-------------------------------------- BASICS OF PLOTTING -----------------------------------------*/
/*                                                                                                   */
/*****************************************************************************************************/

// First chapter