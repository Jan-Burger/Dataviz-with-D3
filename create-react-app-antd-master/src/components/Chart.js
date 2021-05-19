import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import {nest} from 'd3-collection';
import calcPercentage from "../utils/calcPercentage";
import getFullDatesArray from "../utils/getFullDatesArray";

const Chart = (props) => {

    //const [chartWidth, setChartWidth] = useState(parseInt(d3.select(svgRef.current).style("width")));
    //const [chartHeight, setChartHeight] = useState(parseInt(d3.select(svgRef.current).style("height")));

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
    const svgRef = useRef();

    // Creating Chart in useEffect()
    useEffect(() => {
        console.log("useEffect running...")
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
            console.log(DataArray);


            // Dimensions of the chart
            const margin = 50
            const ctrwidth = parseInt(d3.select(svgRef.current).style("width")) - 2 * margin; // minus margins
            console.log("ctrwidth: ", ctrwidth)
            const ctrheight = parseInt(d3.select(svgRef.current).style("height")) - 2 * margin;
            console.log("ctrheight: ", ctrheight)

            let dimensions = {
                width: 1600,
                height: 800,
                margins: 50
            };
            dimensions.ctrWidth = dimensions.width - 2 * dimensions.margins
            dimensions.ctrHeight = dimensions.height - 2 * dimensions.margins

            //let margin = {top: 20, right: 80, bottom: 30, left: 50};
            //let width = parseInt(d3.select(svgRef.current).style("width"));
            //console.log(width)
            //let height = parseInt(d3.select(svgRef.current).style("height"));
            //console.log(height)

            // Select the svgRef
            const svg = d3.select(svgRef.current)
                //.attr("width", "100%")
                //.attr("height", "100%")
                .style("background-color", "white") // for testing purpose
                //.attr("viewBox", `0 0 100% 100%`)
            //console.log(svg);


            // Creating Container inside the svg Element and transforming
            const ctr = svg.append("g")
                .attr("transform", `translate(${margin}, ${margin})`)


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

            // Adding Path Element to the container
            ctr.selectAll(".line-path")
                .data(nestedData)
                .enter()
                .append("path")
                .attr("d", d => lineGenerator(d.values))
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("class", "line-path") // later on add styles in app.less file and remove them here


            // Adding Axis
            const yAxisLeft = d3.axisLeft(yScale)
                .tickFormat((label) => `$${label}`)

            ctr.append("g")
                .call(yAxisLeft)

            const yAxisRight = d3.axisRight(yScale)
                .tickFormat((label) => `$${label}`)

            ctr.append("g")
                .call(yAxisRight)
                .style("transform", `translate(${ctrwidth}px)`)
                .attr("class", "y axis")

            const xAxis = d3.axisBottom(xScale)

            ctr.append("g")
                .call(xAxis)
                .style("transform", `translateY(${ctrheight}px)`)
                .attr("class", "x axis")



        //xScale.range([0, width]);
        //yScale.range([height, 0]);

        function handleResize() {

        let margins = 50
        let width = parseInt(d3.select(svgRef.current).style("width")) - 2 * margins; // minus margins
        console.log(width)
        let height = parseInt(d3.select(svgRef.current).style("height")) -  2 * margins;
        console.log(height)
        xScale.range([0, width]);
        yScale.range([height, 0]);

        svg.select('.x.axis')
            .style("transform", `translateY(${height}px)`)
            .call(xAxis);

        svg.select('.y.axis')
            .style("transform", `translateX(${width}px)`)
            .call(yAxisRight);

        svg.selectAll('.line-path') //path
            .attr("d", d => lineGenerator(d.values)); // LineGenerator

        xAxis.ticks(Math.max(width/75, 2));
        yAxisRight.ticks(Math.max(height/50, 2));
}

        window.addEventListener('resize', handleResize)


        }

        return () => {d3.select("g").remove()}





    }, [data, rawData, percentageData])



    // Resizing Chart on window object change
    useEffect(() => {
        //let width = parseInt(d3.select(svgRef.current).style("width"));
        //console.log(width)
        //let height = parseInt(d3.select(svgRef.current).style("height"));
        //console.log(height)
    }, [])


    return (
        <svg ref={svgRef} className="svgchart"></svg>
    );
};

export default Chart;
