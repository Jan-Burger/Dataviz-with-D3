import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import {nest} from 'd3-collection';
import ResizeObserver from "resize-observer-polyfill";



// Custom react hook which uses the resizeobserver API to observe any size changes in the parent div of the svg element (svg itself is not supported)
const useResizeObserver = (ref) => {
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
        const observedTarget = ref.current;
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                setDimensions(entry.contentRect);
            })
        })
        resizeObserver.observe(observedTarget);
        return () => {resizeObserver.unobserve(observedTarget);}
    }, [ref]);

    return dimensions;
}



const Chart = (props) => {



    //const [chartWidth, setChartWidth] = useState(parseInt(d3.select(svgRef.current).style("width")));
    //const [chartHeight, setChartHeight] = useState(parseInt(d3.select(svgRef.current).style("height")));

    // Chart Dimensions (width and height)
    //const [chartWidth, setChartWidth] = useState(0);
    //const [chartHeight, setChartHeight] = useState(0);



    // margin of y left axis needs to be adjusted


    //console.log(chartHeight, chartWidth)
    const defaultstartdate = "2020-01-01";
    const defaultenddate = "2020-12-31";
    const startdate = props.startdate;
    const enddate = props.enddate;
    //const xvalues = props.xvalues;
    //const yvalues = props.yvalues;
    // data is an Array on Objects --> [{date: ..., price: ...}, ...]
    let data = props.data;
    let rawData = props.rawData;
    let percentageData = props.percentageData;
    let legendColors = props.legend;

    //let stock = percentageData["MSFT"];
    //console.log(stock)
    // Dont forget to add --> if len data === 0: --> no data or to many requests

    // Calc percentage of all stocks in raw data
    //let percentageData = {};
    //for (let key in rawData) {
        //percentageData[key] = calcPercentage(defaultstartdate, defaultenddate, rawData[key])
    //}
    //console.log(percentageData)

    // ORDER OF ALL D3 STEPS:
    // 1. Transform the Data from state into a single array for further processing
    // 2. Declare Dimensions of the chart
    // 3. Select SVG Element via Ref() and append a g-element
    // 4. ...

    // Declaring svg Ref
    const tooltipRef = useRef();
    const wrapperRef = useRef();
    const svgRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [currentZoomState, setCurrentZoomState] = useState();
    const [event, setEvent] = useState();
    const [d, setD] = useState();



    // Creating Line Chart in useEffect()
    useEffect(() => {



        console.log("useEffect running...")
        console.log(dimensions);
        // If dimensions are not set --> return nothing
        if (!dimensions) return;
        if (!(Object.keys(percentageData).length === 0)) {
            console.log("stock data available...")
            console.log(percentageData)
            //console.log(stock)
            //console.log(percentageData)

            // Transform Data into single Array
            let DataArray= [];
            for (let key in percentageData){
                let array = percentageData[key];
                array.forEach(element => DataArray.push(element));
            }
            console.log("Data Array in next line:")
            console.log(DataArray);


            // Dimensions of the chart
            const margin = 50;
            const ctrwidth = dimensions.width - 2 * margin;
            console.log("ctrwidth: ", ctrwidth);
            const ctrheight = dimensions.height - 2 * margin;
            console.log("ctrheight: ", ctrheight);


            /*
            let dimensions = {
                width: 1600,
                height: 800,
                margins: 50
            };
            dimensions.ctrWidth = dimensions.width - 2 * dimensions.margins
            dimensions.ctrHeight = dimensions.height - 2 * dimensions.margins
            */
            //let margin = {top: 20, right: 80, bottom: 30, left: 50};
            //let width = parseInt(d3.select(svgRef.current).style("width"));
            //console.log(width)
            //let height = parseInt(d3.select(svgRef.current).style("height"));
            //console.log(height)

            // Select the svgRef
            const svg = d3.select(svgRef.current)
                //.attr("width", "100%")
                //.attr("height", "100%")
                //.style("background-color", "#F7FAFC") // for testing purpose
                //.attr("viewBox", `0 0 100% 100%`)
            //console.log(svg);


            // Creating Container inside the svg Element and transforming
            const ctr = svg.append("g")
                .attr("transform", `translate(${margin}, 60)`)




            // Accessor functions (Preparing Data to be used by D3)
            const parseDate = d3.timeParse("%Y-%m-%d")
            const xAccessor = d => parseDate(d.date)
            const yAccessor = d => parseFloat(d.close)
            //console.log(xAccessor(xvalues[0]))



            // Scales
            let xScale = d3.scaleUtc()
                .domain(d3.extent(DataArray, xAccessor))
                .range([0, ctrwidth])

            let yScale = d3.scaleLinear()
                .domain(d3.extent(DataArray, yAccessor))
                .range([ctrheight, 0])
                .nice()


            //console.log(xScale(xAccessor(xvalues[0])), xvalues[0])
            // Create Line Generator with scaled x and y values
            let lineGenerator = d3.line()
                .x((d) => xScale(xAccessor(d)))
                .y((d) => yScale(yAccessor(d)))
            //console.log(lineGenerator(data))


            // Check if zoomstate is defined - if yes --> rescale everything

            if (currentZoomState) {
                if (currentZoomState.k !== 1) {
                    /*
                    console.log(event);
                    console.log(d);
                    console.log(currentZoomState);
                    //d3.select(svgRef.current)
                    //    .selectAll("g")
                    //   .attr('transform', currentZoomState);
                    //ctr.attr("transform", currentZoomState.toString());
                    //ctr.attr("transform", `translate(${currentZoomState.x},0)`);
                    //svg.attr("translate(" + currentZoomState + ")" + " scale(" +currentZoomState + ")")
                    let newxScale = event.rescaleX(xScale);
                    //yScale = currentZoomState.rescaleY(yScale);
                    xScale.domain(newxScale.domain());
                    xScale.range(newxScale.range().map(d =>  event.applyX(d)));
                    console.log(xScale.domain());
                    console.log(xScale.range());
                    //xAxis.scale(newxScale);
                    //d3.select(".x.axis").call(xAxis).attr("transform", `translate(${currentZoomState.x},60)`);

                    //lineGenerator = d3.line()
                     //   .x((d) => newxScale(xAccessor(d)))
                    //    .y((d) => yScale(yAccessor(d)))

                    //ctr.selectAll(".line-path")
                        //.data(nestedData)
                        //.enter()
                    //    .attr("d", d => lineGenerator(d.values))
                        //.attr("transform", `translate(${currentZoomState.x},-60)`);


                    //xScale.range([0, ctrwidth])
                     //   .domain(d => currentZoomState.applyX(d));

                    //ctr.selectAll(".line-path")
                    //    .attr("d", d => lineGenerator(d.values))
                     //   .attr("transform", `translate(${currentZoomState.x},60)`);

                    //svg.select(".x.axis")
                    //    .attr("transform", `translate(${currentZoomState.x},0)`);
                        //.call(d3.axisBottom(xScale)
                            //.tickSizeOuter(0));

                    //d3.select(svgRef.current).selectAll("g").selectAll("g").remove()
                    //const newXScale = currentZoomState.rescaleX(xScale);
                    //xScale.domain(newXScale.domain());

                    // Update all line-plot elements with new line method that incorporates transform
                    //ctr.selectAll(".line-path")
                     //   .attr("d", d => lineGenerator(d.values))
                     //   .attr("transform", currentZoomState)

                    /*
                    // Rescale axes using current zoom transform state
                    d3.select(".x.axis").call(xAxis.scale(currentZoomState.rescaleX(xScale)));
                    d3.select(".y.axis-right").call(yAxisRight.scale(currentZoomState.rescaleY(yScale)));
                    d3.select(".y.axis-left").call(yAxisLeft.scale(currentZoomState.rescaleY(yScale)));

                    // Create new scales that incorporate current zoom transform on original scale
                    xScale = currentZoomState.rescaleX(xScale);
                    yScale = currentZoomState.rescaleY(yScale);

                    // Apply new scale to create new definition of d3.line method for path drawing of line plots
                    lineGenerator = d3.line()
                        .x((d) => xScale(xAccessor(d)))
                        .y((d) => yScale(xAccessor(d)));

                    ctr.selectAll(".line-path")
                        .attr("d", d => lineGenerator(d.values))
                        //.attr("transform", currentZoomState)



                    //d3.select(svgRef.current)
                     //   .selectAll("g")
                     //   .attr('transform', `translate(${currentZoomState.x},0)`);

                        // g.selectALL(".line-path")
                    */


                }
            }










            // Nest the Data to display multiple lines
            const nestedData = nest()
                .key(d => d.stockSymbol)
                .entries(DataArray)

            console.log(nestedData)

            console.log("Colors data from legend:")
            let colors = [];
            for (const [key, value] of Object.entries(legendColors)) {
                colors.push(legendColors[key])
            }
            console.log(colors);

            // color scheme
            let res = nestedData.map(function(d){ return d.key }) // list of group names
            let color = d3.scaleOrdinal()
                .domain(res)
                .range(colors)


            // D3 Area chart declerations - this will only be used if props.areaChartIsActive is true
            let area = d3.area()
              .x(function(d) { return xScale(xAccessor(d)); })
              .y0(yScale.range()[0])
              .y1(function(d) { return yScale(yAccessor(d)); });



            // gridlines in x axis function
            function make_x_gridlines() {
                return d3.axisBottom(xScale)
                    .ticks(8)
            }
            // gridlines in y axis function
            function make_y_gridlines() {
                return d3.axisLeft(yScale)
                    .ticks(8)
            }

            // add the X gridlines
            ctr.append("g")
                .attr("class", "grid-x")
                .attr("transform", `translate(0, ${ctrheight})`)
                .call(make_x_gridlines()
                    .tickSize(-ctrheight)
                    .tickFormat("")
            )
            // add the Y gridlines
            ctr.append("g")
                .attr("class", "grid-y")
                //.attr("transform", `translate(0, ${ctrheight})`)
                .call(make_y_gridlines()
                    .tickSize(-ctrwidth)
                    .tickFormat("")
            )

            if (props.areaChartIsActive) {

                // Adding Path Element to the container
                ctr.selectAll(".line-path")
                    .data(nestedData)
                    .enter()
                    .append("path")
                    .attr("d", d => area(d.values))
                    .attr("fill", d => color(d.key))
                    .attr("stroke", d => color(d.key))
                    .attr("stroke-width", 2)
                    .attr("class", "line-path") // later on add styles in app.less file and remove them here
            }else {

                // Adding Path Element to the container
                ctr.selectAll(".line-path")
                    .data(nestedData)
                    .enter()
                    .append("path")
                    .attr("d", d => lineGenerator(d.values))
                    .attr("fill", "none")
                    .attr("stroke", d => color(d.key))
                    .attr("stroke-width", 2)
                    .attr("class", "line-path") // later on add styles in app.less file and remove them here
            }

            const focus = ctr.append('g')
              .attr('class', 'focus')
              //.style('display', 'none');

            focus.append('circle')
              .attr('r', 4.5);

            focus.append('line')
              .classed('x', true);

            focus.append('line')
              .classed('y', true);

            focus.append('text')
              .attr('x', 9)
              .attr('dy', '.35em');

            // --- Adding Axis and background grid --- //




            // Y Axis left
            const yAxisLeft = d3.axisLeft(yScale)
                .tickFormat((label) => `${label}%`)
                .ticks(Math.max(ctrheight/50, 2));

            ctr.append("g")
                .call(yAxisLeft)
                .attr("class", "y axis-left")


            // Y Axis right
            const yAxisRight = d3.axisRight(yScale)
                .tickFormat((label) => `${label}%`)
                .ticks(Math.max(ctrheight/50, 2));

            ctr.append("g")
                .call(yAxisRight)
                .style("transform", `translate(${ctrwidth}px)`)
                .attr("class", "y axis-right")


            // Axis Bottom
            const xAxis = d3.axisBottom(xScale)
                .ticks(Math.max(ctrwidth/75, 2));

            ctr.append("g")
                .call(xAxis)
                .style("transform", `translateY(${ctrheight}px)`)
                .attr("class", "x axis")











            /* --- Hover action and tooltip --- */
            if (props.hoverTootipIsActive) {


                // selecting the tooltip div and appending line to the svg container
                const tooltip = d3.select(tooltipRef.current);
                const tooltipLine = ctr.append("line");


                // Function onmouse move which will draw the tooltip if the mouse is moved over the chart
                const drawTooltip = (event) => {
                    console.log("Mouse hovers over chart...");
                    console.log(xScale.invert(d3.pointer(event)[0]));
                    let date = xScale.invert(d3.pointer(event)[0]);
                    console.log(date.toISOString().slice(0,10));
                    //let resultDate = new Date();
                    let resultDate = new Date(date.setDate(date.getDate() + 1));
                    console.log(resultDate);
                    let resultDateForScale = new Date(date.setDate(date.getDate() - 1));




                    //const year = Math.floor((xScale.invert(d3.pointer(tipBox.node())[0]) + 5) / 10) * 10;
                    //console.log(d3.pointer(this));

                    //states.sort((a, b) => {
                    //return b.history.find(h => h.year == year).population - a.history.find(h => h.year == year).population;
                    //})

                    // `${d.key}: some value in %`
                    tooltipLine.attr('stroke', '#DFE6ED')
                        .attr('x1', xScale(resultDateForScale))
                        .attr('x2', xScale(resultDateForScale))
                        .attr('y1', 0)
                        .attr('y2', ctrheight);

                    tooltip.html(`Date: ${resultDate.toISOString().slice(0,10)}`)
                        .style('display', 'block')
                        .style('left', 150)
                        .style('top', 150)
                        .selectAll()
                        .data(nestedData).enter()
                        .append('div')
                        .style('color', d => color(d.key))
                        .html(d => {
                            console.log(d.key);
                            console.log(d.values);
                            console.log(d.values.find(value => value.date == resultDate.toISOString().slice(0,10)));
                            console.log(resultDate.toISOString().slice(0,10));
                            if (d.values.find(value => value.date == resultDate.toISOString().slice(0,10))){
                                return `${d.key}: ${Math.round((d.values.find(value => value.date == resultDate.toISOString().slice(0,10)).close + Number.EPSILON) * 100) / 100}%`
                            }else {
                                return `${d.key}: No Data`
                            }

                        });
                    // + ': ' + d.history.find(h => h.year == year).population

                    ctr.selectAll(".line-path")
                        .append('circle')
                        .attr('r', 4.5);


                }

                // Function onmouseout which will destroy the tooltip if the mouse leaves the svg container
                const removeTooltip = () => {
                    console.log("Mouse just left the chart...")
                    if (tooltip) tooltip.style('display', 'none');
                    if (tooltipLine) tooltipLine.attr('stroke', 'none');
                }


                // Append the tooltip to the svg container
                const tipBox = ctr.append('rect')
                    .attr('width', ctrwidth)
                    .attr('height', ctrheight)
                    .attr('opacity', 0)
                    .on('mousemove', (event) => {drawTooltip(event)})
                    .on('mouseout', removeTooltip);
            }


            // Zoom behaviour
            const zoomBehaviour = d3.zoom()
                .scaleExtent([1, 5])
                .translateExtent([[0,0],[ctrwidth, ctrheight]])
                .on("zoom", (event, d) => {
                    console.log(event);
                    console.log(event.transform);
                    const zoomState = d3.zoomTransform(svg.select("g").node());
                    console.log(svg.select("g").node());
                    setCurrentZoomState(zoomState);
                    setEvent(event.transform);
                    setD(d);
                    console.log(zoomState);
                    let newxScale = zoomState.rescaleX(xScale);
                    //yScale = currentZoomState.rescaleY(yScale);
                    //xScale.domain(newxScale.domain());
                    //xScale.range(newxScale.range().map(d =>  zoomState.applyX(d)));
                    //console.log(xScale.domain());
                    //console.log(xScale.range());
                    ctr.attr("transform", `translate(${zoomState.x},0)`);
                    // Rescale axes using current zoom transform state
                    d3.select(".x.axis").call(xAxis.scale(zoomState.rescaleX(xScale)));
                    //d3.select(".y.axis-right").call(yAxisRight.scale(zoomState.rescaleY(yScale)));
                    //d3.select(".y.axis-left").call(yAxisLeft.scale(zoomState.rescaleY(yScale)));

                    // Create new scales that incorporate current zoom transform on original scale
                    xScale = zoomState.rescaleX(xScale);
                    //yScale = zoomState.rescaleY(yScale);
                    console.log(xScale.domain());

                    // Apply new scale to create new definition of d3.line method for path drawing of line plots
                    lineGenerator = d3.line()
                        .x((d) => xScale(xAccessor(d)))
                        .y((d) => yScale(xAccessor(d)));

                    ctr.selectAll(".line-path")
                        .data(nestedData)
                        .enter()
                        .append("path")
                        .attr("d", d => lineGenerator(d.values))
                        .attr("fill", "none")
                        .attr("stroke", d => color(d.key))
                        .attr("stroke-width", 2)
                        .attr("class", "line-path") // later on add styles in app.less file and remove them here
                });

            svg.call(zoomBehaviour);

            /*
            svg.call(zoom);
            function zoom(svg) {

                var extent = [
                    [margin, margin],
                    [ctrwidth, ctrheight]
                ];

                var zooming = d3.zoom()
                    .scaleExtent([1, 5])
                    .translateExtent(extent)
                    .extent(extent)
                    .on("zoom", zoomed);

                svg.call(zooming);

                function zoomed() {
                    const zoomState = d3.zoomTransform(svg.node());
                    const newXScale = zoomState.rescaleX(xScale);
                    xScale.range(newXScale.range());

                    //xScale.range([0, ctrwidth])
                     //   .map(d => zoomState.applyX(d));

                    svg.selectAll(".line-path")
                        .attr("d", d => lineGenerator(d.values));

                    svg.select(".x.axis")
                        .call(d3.axisBottom(xScale)
                            .tickSizeOuter(0));
                }
            }
            */



        }

        return () => {d3.selectAll("g").remove()}


    },[data, rawData, percentageData, dimensions, props.hoverTootipIsActive, currentZoomState, props.areaChartIsActive])




    return (
        <div ref={wrapperRef}>
            <svg ref={svgRef} className="svgchart"></svg>
            {Object.keys(rawData).length > 0 && props.hoverTootipIsActive ? <div className="tooltip" ref={tooltipRef} style={{
                display: "none",
                position: "absolute",
                backgroundColor: "#DFE6ED",
                padding: "7.5px",
                color: "#57697A",
                top: "145px",
                marginLeft: "75px"
            }}></div>: ""}

        </div>
    );
};

export default Chart;
// TODO - Render background grid first  --> before lines are rended