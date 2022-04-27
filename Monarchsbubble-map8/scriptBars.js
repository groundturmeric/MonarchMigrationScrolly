
function parseCsv(d) {
    // if (+d.Year > 2018 && d.species != "Milkweed Sighted" && d.species != "Milkweed (FIRST sighted)") {
    // if (+d.Year > 2018) {
    return {
        area: +d.AreaOccupied, // Changing name of column/property
        winterSeason: d.winterSeason,
        // }
    }
}
d3.csv("./data/AreaOccupiedByMonarchs.csv", parseCsv).then(function (data) {

    console.log(data)
    /*
    DEFINE DIMENSIONS OF SVG + CREATE SVG CANVAS
    */
    // const width = document.querySelector("#chart2").clientWidth;
    // const height = document.querySelector("#chart2").clientHeight;

    const width = 1000;
    const height = 600;
    const margin = { top: 50, left: 150, right: 50, bottom: 100 };

    const svg = d3.select("#barChart")
        .append("svg")
        // .attr("width", width)
        // .attr("height", height)
        .attr("viewBox", "0 0 " + window.innerWidth + " " + window.innerHeight)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("background-color", "rgba(0,0,0,0");



    const occupiedAreaRange = {
        min: d3.min(data, function (d) { return d.area; }),
        max: d3.max(data, function (d) { return d.area; })
    };

    // console.log(occupiedAreaRange)

    /*
    TASK 4: CREATE SCALES
    */

    // USING ES6 SETS and SPREAD OPERATOR to retrieve planets categories

    // Retrieve `d.category` for each row in the data set
    let allWinters = data.map(function (d) {
        return d.winterSeason;
    });

    // Turn result of above into an ES6 Set,
    // and then spread the values into a flat array
    const winters = [...new Set(allWinters)];


    const xScale = d3.scaleBand()
        .domain(winters)
        .range([margin.left, width - margin.right])
        .padding(0.5);;

    const yScale = d3.scaleLinear()
        .domain([occupiedAreaRange.min, occupiedAreaRange.max])
        .range([height - margin.bottom, margin.top]);;

    // add more colors for further planets!
    // i did not use planetcategories for the domain just to match planets and colors
    // const fillScale = d3.scaleOrdinal()
    // .domain(["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Pluto","Uranus","Neptune", "136108 Haumea", "136472 Makemake","1 Cerens","136199 Eris"])
    // .range(['#A17F5D','#E89624','#518E87','#964120','#F8800F','#E0B463',"#D1E3F4", '#515CA8', '#2990B5', '#FACDDC', '#FAA1AF', '#8d7979', '#D4cccc']);


    // GLOW ATTEMPT
    // source: https://www.visualcinnamon.com/2016/06/glow-filter-d3-visualization/
    //Container for the gradients
    // var defs = svg.append("defs");

    // //Filter for the outside glow
    // var filter = defs.append("filter")
    //     .attr("id", "glow");
    // filter.append("feGaussianBlur")
    //     .attr("stdDeviation", "3.0")
    //     .attr("result", "coloredBlur");
    // var feMerge = filter.append("feMerge");
    // feMerge.append("feMergeNode")
    //     .attr("in", "coloredBlur");
    // feMerge.append("feMergeNode")
    //     .attr("in", "SourceGraphic");

    /*
    DRAW AXES
    */
    const xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom().scale(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");;

    const yAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));


    /*
    TASK 5: DRAW BARS
    */
    const bars = svg.selectAll()
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) { return xScale(d.winterSeason); })
        .attr("y", function (d) { return yScale(d.area); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - margin.bottom - yScale(d.area); })
        // .attr("fill", function(d) { return fillScale(d.name); })
        .attr("fill", "orange")
        .attr("stroke", "white")
        .attr("stroke-width", 0.7)
        // .style("filter", "url(#glow)");


    /*
    DRAW AXIS LABELS
    */
    const xAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom / 2 + 50 )
        .text("Winter Season")
        .attr("fill", "black")

    const yAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", margin.left / 2)
        .text("Hectares (ha) Occupied by Overwintering Monarch Colonies")
        .attr("fill", "black");



    //<<<<>>>><<<<ooOoo>>>>((((()))))<<<<ooOoo>>>><<<<>>>>\\
    //<<<<>>>><<<<>>>>((((( ADD TOOLTIP)))))<<<<>>>><<<<>>>>\\
    //<<<<>>>><<<<ooOoo>>>>((((()))))<<<<ooOoo>>>><<<<>>>>\\

    const tooltip = d3.select("#barChart")
        .append("div")
        .attr("class", "barTooltip");




    svg.selectAll("rect")
        .on("mouseover", function (e, d) { //first argument e referes to the circle, d refers to datum!
            // console.log(e)

            let tw = svg.node().clientWidth;
            let th = svg.node().clientHeight;
            let sx = tw / width;
            let sy = th / height;
            // let x = +d3.select(this).attr("x") * sx;
            // let y = +d3.select(this).attr("y") * sy;

            let ttx = d3.pointer(event)[0] * sx;;
            let tty = d3.pointer(event)[1] * sy;;

            let x = e.offsetX;
            let y = e.offsetY;


            tooltip.style("visibility", "visible")
                .style("left", `${x}px`)
                .style("top", `${y}px`)
                // .style("left", `${ttx}px`)
                // .style("top", `${tty}px`)
                .html(`<b>${d.area} ha
                        <br> winter ${d.winterSeason} </b>`);

            d3.select(this)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 1);

        }).on("mouseout", function () {

            tooltip.style("visibility", "hidden")
                .style("pointer-events", "none");


            d3.select(this)
            .attr("stroke", "white")
                // .attr("stroke", "white")
                .attr("stroke-width", 0.7)
            // .attr("stroke-opacity", 0.5);

        });



});


