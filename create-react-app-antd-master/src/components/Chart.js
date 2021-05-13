import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

const Chart = (props) => {

    const startdate = props.startdate;
    const enddate = props.enddate;
    //const xvalues = props.xvalues;
    //const yvalues = props.yvalues;
    // data is an Array on Objects --> [{date: ..., price: ...}, ...]
    let data = props.data;
    // Dont forget to add --> if len data === 0: --> no data or to many requests

    // Declaring svg Ref
    const svgRef = useRef();

    // Creating Chart in useEffect()
    useEffect(() => {
        if (data) {

            // Dimensions of the chart
            let dimensions = {
                width: 1600,
                height: 800,
                margins: 50
            };
            dimensions.ctrWidth = dimensions.width - 2 * dimensions.margins
            dimensions.ctrHeight = dimensions.height - 2 * dimensions.margins


            // Select the svgRef
            const svg = d3.select(svgRef.current)
                .attr("width", dimensions.width)
                .attr("height", dimensions.height)
                .style("background-color", "red") // for testing purpose
            //console.log(svg);


            // Creating Container inside the svg Element and transforming
            const ctr = svg.append("g")
                .attr("transform", `translate(${dimensions.margins}, ${dimensions.margins})`)


            // Accessor functions (Preparing Data to be used by D3)
            const parseDate = d3.timeParse("%Y-%m-%d")
            const xAccessor = d => parseDate(d.date)
            const yAccessor = d => parseFloat(d.close)
            //console.log(xAccessor(xvalues[0]))


            // Scales
            const xScale = d3.scaleUtc()
                .domain(d3.extent(data, xAccessor))
                .range([0, dimensions.ctrWidth])

            const yScale = d3.scaleLinear()
                .domain(d3.extent(data, yAccessor))
                .range([dimensions.ctrHeight, 0])
                .nice()
            //console.log(xScale(xAccessor(xvalues[0])), xvalues[0])


            // Create Line Generator with scaled x and y values
            const lineGenerator = d3.line()
                .x((d) => xScale(xAccessor(d)))
                .y((d) => yScale(yAccessor(d)))
            //console.log(lineGenerator(data))


            // Adding Path Element to the container
            ctr.append("path")
                .datum(data)
                .attr("d", lineGenerator)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 2)


            // Adding Axis
            const yAxisLeft = d3.axisLeft(yScale)
                .tickFormat((label) => `$${label}`)

            ctr.append("g")
                .call(yAxisLeft)

            const yAxisRight = d3.axisRight(yScale)
                .tickFormat((label) => `$${label}`)

            ctr.append("g")
                .call(yAxisRight)
                .style("transform", `translate(${dimensions.ctrWidth}px)`)

            const xAxis = d3.axisBottom(xScale)

            ctr.append("g")
                .call(xAxis)
                .style("transform", `translateY(${dimensions.ctrHeight}px)`)


        }

    }, [data])

    return (
        <svg ref={svgRef}></svg>
    );
};

export default Chart;