// using d3 for convenience, and storing a selected elements
var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');
let data = [];
var chartWidth;
var chartHeight;
var winter;
var spring;
var summer;
var fall;
var spring3


// const width = window.innerWidth;
// const height = window.innerHeight;



var svg = chart.append('svg')
    // .attr("viewBox", "0 0 " + window.innerWidth  + " " + window.innerHeight )
    // .attr("viewBox", "0 0 " + 500  + " " +1500 )
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + window.innerWidth + " " + window.innerHeight)
    .attr("id", "map-svg")



//               VALUES TO PARSE:
//
// sighting_date,species,number,latitude,longitude,
// image_url,Year,Month,Week_Day,comments

function parseCsv(d) {
    // if (+d.Year > 2018 && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") {
    // if (+d.Year > 2018) {
    return {
        species: d.species,
        date: d.sighting_date,
        // channel: d.channelTitle, // We can exclude columns from the data
        number: +d.number,
        latitude: +d.latitude, // Changing name of column/property
        longitude: +d.longitude, // Changing name of column/property
        url: d.image_url,
        year: +d.Year,
        month: d.Month,
        weekDay: d.Week_Day,
        comments: d.comments
        // }
    }
}
///////////








//            PROJECTION SETTINGS:
//
// define the settings for map projection


var projection = d3.geoEqualEarth()

    .translate([window.innerWidth / 2, window.innerHeight / 2])  // ????
    .scale(1000)
    .center([-104, -242]);

// create the geo path generator
let geoPathGenerator = d3.geoPath().projection(projection);
///////////










//               GROUP ELEMENT
// great a g element to append all of our objects to
const g = svg.append("g");






//            ADD TOOLTIP FOR LATER
const tooltip =
    // d3.select("#scroll .scroll__graphic")
    d3.select("#scroll .scroll__graphic")
        .append("div")
        .attr("class", "mapTooltip")
// .attr("preserveAspectRatio", "xMinYMin meet")
// .attr("viewBox", "0 0 " + width + " " + height);





//                                                      //
/////                DATA TO MAPPING                 /////
//////                                             ///////
///////                                          /////////
var files = [
    // { "type": "json", "file": "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson" },
    { "type": "json", "file": "./Namericas.geojson" },
    { "type": "csv", "file": "./data/Monarchs3.csv" },
];
let promises = [];

// for each file type, add the corresponding d3 load function to our promises
files.forEach(function (d) {
    if (d.type == "json") {
        promises.push(d3.json(d.file));
    } else {
        promises.push(d3.csv(d.file, parseCsv));
    }
});

// when our data has been loaded, call the draw map function
Promise.all(promises).then(function (values) {
    drawMap(values[0], values[1]);
});



function drawMap(geo, data) {

    // our function has two parameters, both of which should be data objects
    // console.log('GEO: ', geo)
    // console.log('dataset: ', data)



    // data processing: //

    let speciesPerRow = data.map(function (d) {
        return d.species;
    })
    // console.log(speciesPerRow)
    let allSpecies = [...new Set(speciesPerRow)]
    console.log(allSpecies)

    let YearPerRow = data.map(function (d) {
        return d.year;
    })
    // console.log(speciesPerRow)
    let allYears = [...new Set(YearPerRow)]
    console.log(allYears)

    let MonthPerRow = data.map(function (d) {
        return d.month;
    })
    // console.log(speciesPerRow)
    let allMonths = [...new Set(MonthPerRow)];
    console.log(allMonths);

    // instead of using js method i'll write the months in the order of the narrative to pick colors for each
    let monthsOrder = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];


    var milkweed = data.filter(function (d) { return (d.species == "Milkweed Sighted" || d.species == "Milkweed (FIRST sighted)") });

    // console.log(milkweed)



    // filter only butterfly stages, remove any milkweed data
    var jan = data.filter(function (d) { return (d.month == "Jan" && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") });
    var feb = data.filter(function (d) { return (d.month == "Feb" && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") });
    var mar = data.filter(function (d) { return (d.month == "Mar" && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") });
    var apr = data.filter(function (d) { return (d.month == "Apr" && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") });
    var may = data.filter(function (d) { return (d.month == "May" && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") });
    var jun = data.filter(function (d) { return (d.month == "Jun" && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") });
    var jul = data.filter(function (d) { return (d.month == "Jul" && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") });
    var aug = data.filter(function (d) { return (d.month == "Aug" && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") });
    var sep = data.filter(function (d) { return (d.month == "Sep" && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") });
    var oct = data.filter(function (d) { return (d.month == "Oct" && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") });
    var nov = data.filter(function (d) { return (d.month == "Nov" && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") });
    var dec = data.filter(function (d) { return (d.month == "Dec" && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") });




    // Draw the map
    var basemap = g
        .selectAll("path")
        .data(geo.features)
        .enter()
        .append("path")
        .attr("class", 'continent')
        // draw each country
        .attr("d", geoPathGenerator)
        // .attr("country", function (d) { return d.id })
        // .attr("fill", "#eeeeee")
        .attr("opacity", 1)
        
    ///////////////DRAW CIRCLES
    // const colorScale = d3.scaleOrdinal(d3.schemeSet2)
    // const speciesColorScale = d3.scaleOrdinal(d3.schemeCategory10)
    //     .domain(allSpecies)
    //     .range(["yellow", "yellow", "orange","yellow","orange", "#87f462", "#2b9d33", "yellow", "orange", "#007edd", "#01e7bd"]);
    // const speciesColorScale = d3.scaleOrdinal(d3.schemeSet3)
    //     .domain(allSpecies)

    // const speciesColorScale = d3.scaleOrdinal(d3.schemeSet3)
    //     .domain(allSpecies)
        
        const speciesColorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(allSpecies)
        .range(["#efae2c", //adult
                "yellow", //captive
                "#01e7bd", // monarch larvae#D7ECE2
                "#efae2c", // adult
                "green", //milkweed
                "white", //egg
                "red", //peak migration
                "green",  //milkweed
                "#4E21D7", // other
                "#97BBFD", //fall roost
                "#01e7bd", //monarch larvae first sighted
                "white"]); //  egg

    // const monthsColorScale = d3.scaleOrdinal(d3.schemeCategory10)
    //     // .domain(allMonths)
    //     .domain(monthsOrder)
    //     .range(["#9e0142",
    //         "#9e0142",
    //         "#9e0142",
    //         "#d53e4f",
    //         "#d53e4f",
    //         "#d53e4f",
    //         "#f46d43",
    //         "#f46d43",
    //         "#f46d43",
    //         "#fdae61",
    //         "#fdae61",
    //         "#fdae61",])


    // create a LEGEND group and tranform it to be top left of page
    // var legend = svg.append("g")
    //     .attr("transform", "translate(20,20)");

    // add a title for the legend
    // legend.append("text")
    //     .attr("x", 1500)
    //     .attr("y", 2000)
    //     .text("month")

    // use a for loop to draw a few sample circle sizes for our legend
    // next to each circle, add the corresponding number value
    // we can see what our "max" magnitude is by inspecting the domain of our rScale

    // monthsColorScale.domain().forEach((d, i) => {
    //     // console.log(i)
    //     legend.append("circle")
    //         .attr("cx", 1500 + 20)
    //         .attr("cy", 2000 + 20 + 15 * i)
    //         .attr("r", 10)
    //         .attr("fill", monthsColorScale(d))

    //     legend.append("text")
    //         .attr("x", 1500 + 50)
    //         .attr("y", 2000 + 20 + 15 * i)
    //         .text(d);

    // })


    function updateCircles(dataset, scale = 1) {
        // draw dots for each earthquake
        const circles = g
            .selectAll('circle')
            .data(dataset)
            // .join('circle')
            .join(
                function (enter) {
                    return enter
                        .append('circle')
                        .style('opacity', 0)
                        .attr("cx", function (d) {
                            // console.log(projection([d.longitude, d.latitude]))
                            return projection([d.longitude, d.latitude])[0]
                        })

                        .attr("cy", function (d) { return projection([d.longitude, d.latitude])[1] });
                },
                function (update) {
                    return update
                        .style('opacity', 1)
                        .transition()
                        .duration(500)

                        .attr("cx", function (d) {
                            // console.log(projection([d.longitude, d.latitude]))
                            return projection([d.longitude, d.latitude])[0]
                        })
                        .attr("cy", function (d) { return projection([d.longitude, d.latitude])[1] });
                },
                function (exit) {
                    return exit.remove();
                }
            )
            .attr("class", 'bubbles')
            .style("stroke-width", 0)
            .style("stroke", "gray")
            .attr("fill-opacity", 1)
            // .attr("fill", "orange")
            // .attr("fill", function (d) {
            //     return monthsColorScale(d.month);
            // })
                   .attr("fill", function (d) {
                return speciesColorScale(d.species);
            })
            .attr("r", 3)
            .on("mouseover", function (e, d) {

                let width = window.innerWidth;
                let height = window.innerHeight;

                let tw = svg.node().clientWidth;
                let th = svg.node().clientHeight;
                let sx = tw / width;
                let sy = th / height;

                // console.log(this)
                let cx = +d3.select(this).attr("cx") * sx + 0;
                let cy = +d3.select(this).attr("cy") * sy - 0;
                let ttx = d3.pointer(event)[0] * sx;;
                let tty = d3.pointer(event)[1] * sy;;

                let x = e.offsetX;
                let y = e.offsetY;







                // `url(${function (d) {
                //     return d.url
                // }
                //     })`);

                tooltip.style("visibility", "visible")
                    // .style("left", `${cx}px`)
                    // .style("top", `${cy}px`)
                    .style("left", x + "px")
                    .style("top", y + "px")
                    .html(`<b>${d.species}</b>
                            <br>${d.date}
                            <br>
                            <img src="${d.url}" alt="no picture" style="float:left; height:13vh;">
                        `);
                {/* <img src="images/incomeLegend.png" alt="alt text" style="float:left; height:13vh; transform:translateY(4.6vh)"  ></img> */ }

                d3.select(this)
                    .attr("r", 10)
                    // .attr("r", 10 / k)
                    // .attr("stroke", "white")
                    .attr("stroke-width", 3)
                    .attr("stroke-opacity", 1);

            }).on("mouseout", function () {

                tooltip.style("visibility", "hidden")
                    .style("pointer-events", "none");;

                d3.select(this)
                    .attr("r", 3)
                    // .attr("stroke", "white")
                    .attr("stroke-width", 0)
                    .attr("stroke-opacity", 0);

            });
    }





    //draw circles once
    // updateCircles(data);

    function milkweedCircles(dataset, scale = 1) {
        // draw dots for each earthquake
        const circles = g
            .selectAll('circle')
            .data(dataset)
            // .join('circle')
            .join(
                function (enter) {
                    return enter
                        .append('circle')
                        .style('opacity', 0)
                },
                function (update) {
                    return update

                        .attr("cx", function (d) {
                            // console.log(projection([d.longitude, d.latitude]))
                            return projection([d.longitude, d.latitude])[0]
                        })
                        .attr("cy", function (d) { return projection([d.longitude, d.latitude])[1] })
                        .transition()
                        .duration(1500)
                        .style('opacity', 1)


                },
                function (exit) {
                    return exit.remove();
                }
            )
            .attr("class", 'bubbles')
            .style("stroke-width", 0)
            .style("stroke", "gray")
            .attr("fill-opacity", 0.5)
            // .attr("fill", "orange")
            .attr("fill", "#99ff99")
            .attr("r", 3)
    }











    ////////////                        //////////////
    /////////                                /////////
    /////                                        /////
    ////                                           //
    //              SCROLLING FUNCTIONS             /
    //                                            ///
    ////                                        ////
    //////                                    //////
    /////////                             //////////
    //////////                           ///////////



    // initialize the scrollama
    var scroller = scrollama();

    // resize function to set dimensions on load and on page resize
    function handleResize() {
        // 1. update height of step elements for breathing room between steps
        var stepHeight = Math.floor(window.innerHeight * 0.7);
        step.style('height', stepHeight + 'px');

        // 2. update height of graphic element
        var bodyWidth = d3.select('body').node().offsetWidth;

        graphic
            .style('height', window.innerHeight + 'px');

        // 3. update width of chart by subtracting from text width
        var chartMargin = 32;
        var textWidth = text.node().offsetWidth;


        var chartWidth = graphic.node().offsetWidth - textWidth - chartMargin; // left
        // chartWidth = graphic.node().offsetWidth; // center
        // make the height 1/2 of viewport
        var chartHeight = Math.floor(window.innerHeight);


        // chart
        //     .style('width', chartWidth + 'px')
        //     .style('height', chartHeight + 'px');

        // 4. tell scrollama to update new element dimensions
        scroller.resize();
    }

    var lastStep;
    // scrollama event handlers
    function handleStepEnter(response) {

        // calculate the direction of scroll
        let dir;
        if ((lastStep - response.index) > 0) {
            dir = 'up'
        } else {
            dir = 'down'
        }





        if (response.index == 1) {
            updateCircles(mar);
        } else if (response.index == 2) {
            updateCircles(apr);

        } else if (response.index == 3) {
            updateCircles(may);

        } else if (response.index == 4) {
            updateCircles(jun);

        } else if (response.index == 5) {
            updateCircles(jul);
        } else if (response.index == 6) {
            updateCircles(aug);
        } else if (response.index == 7) {
            updateCircles(sep);
        } else if (response.index == 8) {
            updateCircles(oct);
        } else if (response.index == 9) {
            updateCircles(nov);
        } else if (response.index == 10) {
            updateCircles(dec);
        } else if (response.index == 11) {
            updateCircles(jan);
        } else if (response.index == 12) {
            updateCircles(feb);
        } else if (response.index == 13) {

            milkweedCircles(milkweed)
        } else if (response.index == 14) {


        }




        // sticky the graphic
        graphic.classed('is-fixed', true);
        graphic.classed('is-bottom', false);


        // fade in current step
        step.classed('is-active', function (d, i) {
            return i === response.index;
        })
        console.log("prev: ", lastStep)
        console.log(response.index)

        // store the last step in a global var
        lastStep = response.index;
    }

    function handleProgress(response) {
        console.log(response)
    }

    // kick-off code to run once on load
    function init() {
        // 1. call a resize on load to update width/height/position of elements
        handleResize();

        // 2. setup the scrollama instance
        // 3. bind scrollama event handlers (this can be chained like below)
        scroller
            .setup({
                container: '#scroll', // our outermost scrollytelling element
                graphic: '.scroll__graphic', // the graphic
                text: '.scroll__text', // the step container
                step: '.scroll__text .step', // the step elements
                offset: 0.5, // set the trigger to be 1/2 way down screen
                debug: false, // display the trigger offset for testing
                progress: false
            })
            .onStepProgress(handleProgress)
            .onStepEnter(handleStepEnter);

        // setup resize event
        window.addEventListener('resize', handleResize);
        function initChart() {
            // define the width/height of SVG
            svg.attr('width', chartWidth).attr('height', chartHeight);
        }

        initChart();
    }

    // start it up
    init();


    //////
    ///
    //



}





