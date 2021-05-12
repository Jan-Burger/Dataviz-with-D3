import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

const Chart = (props) => {

    const startdate = props.startdate;
    const enddate = props.enddate;
    const xvalues = props.xvalues;
    const yvalues = props.yvalues;
    // Dont forget to add --> if len data === 0: --> no data or to many requests

    // Declaring svg Ref
    const svgRef = useRef();

    // Creating Chart in useEffect()
    useEffect(() => {

        // Dimensions of the chart
        let dimensions = {
            width: 600,
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

        // Accessor functions (Preparing Data to be used by D3)
        const parseDate = d3.timeParse("%Y-%m-%d")
        const xAccessor = xvalues => parseDate(xvalues)
        const yAccessor = yvalues => parseFloat(yvalues)

        // Scales
        const xScale = d3.scaleUtc()
            .domain(d3.extent(xvalues, xAccessor))
            .range([0, dimensions.ctrWidth])

    }, [])

    return (
        <svg ref={svgRef}></svg>
    );
};

export default Chart;