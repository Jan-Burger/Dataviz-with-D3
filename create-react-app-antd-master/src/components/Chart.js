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
    const [chartWidth, setChartWidth] = useState(0);
    const [chartHeight, setChartHeight] = useState(0);

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

    // Declaring svg Ref
    const wrapperRef = useRef();
    const svgRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

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
            const xScale = d3.scaleUtc()
                .domain(d3.extent(DataArray, xAccessor))
                .range([0, ctrwidth])

            const yScale = d3.scaleLinear()
                .domain(d3.extent(DataArray, yAccessor))
                .range([ctrheight, 0])
                .nice()
            //console.log(xScale(xAccessor(xvalues[0])), xvalues[0])


            // Create Line Generator with scaled x and y values
            const lineGenerator = d3.line()
                .x((d) => xScale(xAccessor(d)))
                .y((d) => yScale(yAccessor(d)))
            //console.log(lineGenerator(data))

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


            // --- Adding Axis and background grid --- //

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

        }

        return () => {d3.select("g").remove()}


    }, [data, rawData, percentageData, dimensions])




    return (
        <div ref={wrapperRef}>
            <svg ref={svgRef} className="svgchart"></svg>
        </div>
    );
};

export default Chart;
