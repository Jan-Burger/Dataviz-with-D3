import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

const Chart = (props) => {

    //const [chartWidth, setChartWidth] = useState(parseInt(d3.select(svgRef.current).style("width")));
    //const [chartHeight, setChartHeight] = useState(parseInt(d3.select(svgRef.current).style("height")));

    // margin of y left axis needs to be adjusted


    //console.log(chartHeight, chartWidth)

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
        console.log("useEffect running...")
        if (data) {
            console.log("stock data available")
            console.log(data)

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
                .domain(d3.extent(data, xAccessor))
                .range([0, ctrwidth])

            const yScale = d3.scaleLinear()
                .domain(d3.extent(data, yAccessor))
                .range([ctrheight, 0])
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
                .attr("class", "line") // later on add styles in app.less file and remove them here


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

        svg.selectAll('.line') //path
            .attr("d", lineGenerator); // LineGenerator

        xAxis.ticks(Math.max(width/75, 2));
        yAxisRight.ticks(Math.max(height/50, 2));
}

        window.addEventListener('resize', handleResize)


        }

        return () => {d3.select("g").remove()}





    }, [data])



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
