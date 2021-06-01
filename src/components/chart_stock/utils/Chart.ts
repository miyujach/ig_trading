/* eslint-disable */

import * as d3 from 'd3';

export class Chart {
    constructor(document: any) { 
        this.init(document);
    }

    //function
    init = (document: any) => {
        // set the dimensions and margins of the graph
        var svg = d3.select("#ig-trading-chart")

        var margin = {top: 20, right: 20, bottom: 110, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        var margin2 = {top: 430, right: 20, bottom: 30, left: 40},
        width2 = 960 - margin2.left - margin2.right,
        height2 = 500 - margin2.top - margin2.bottom;

        // parse the date / time
        var parseTime = d3.timeParse("%Y-%m-%d");
        //var parseTime = d3.timeParse("%d-%b-%y");

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);
        var x2 = d3.scaleTime().range([0, width2]);
        var y2 = d3.scaleLinear().range([height2, 0]);

        var xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

        var brush: any = d3.brushX()
            .extent([[0, 0], [width, height2]])
            .on("brush end", (event: any, d: any) => {
                if (event.sourceEvent && event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
                var s = event.selection || x2.range();
                
                x.domain(s.map(x2.invert, x2));
                
                // line_chart.select(".line").attr("d", line);
                // focus.select(".axis--x").call(xAxis);

                svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                    .scale(width / (s[1] - s[0]))
                    .translate(-s[0], 0));
            });


        var zoom: any = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", (event: any, d: any) => {
                if (event.sourceEvent && event.sourceEvent.type === "brush") return; // ignore zoom-by-brush

                var t = event.transform;
                gX.call(xAxis.scale(event.transform.rescaleX(x)));
                // svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                //     .scale(width / 2)
                //     .translate(0, 0));

                line_chart.selectAll('.dot')
                    .attr("cx", (d: any) => { return x(d.date) })
                    .attr("cy", (d: any) => { return y(d.value); });

                line_chart.select(".line").attr("d", line);
                focus.select(".axis--x").call(xAxis);
            });
            

        // define the line
        var line = d3.line()
            .x(function(d: any) { return x(d.date); })
            .y(function(d: any) { return y(d.value); });
        
        var line2 = d3.line()
            .x(function(d: any) { return x2(d.date); })
            .y(function(d: any) { return y2(d.value); });

        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0); 

        var line_chart = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("clip-path", "url(#clip)");

        
        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var chart = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");




        var gX = focus.append("g")
            .attr("transform", "translate(0," + height + ")");

            

        var gX2 = context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")");

        // Get the data
        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv").then(function(data: any) {

            // format the data
            data.forEach(function(d: any) {
                d.date = parseTime(d.date);
                d.value = +d.value;
            });

            // Scale the range of the data
            x.domain(d3.extent(data, function(d: any) { return d.date; }));
            y.domain([0, d3.max(data, function(d: any) { return d.value; })]);

            x2.domain(x.domain());
            y2.domain(y.domain());
            
            // Add the line path.
            line_chart.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", line);
            
            // Add the circlle to the path.
            line_chart
                .selectAll('.circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('cx', (d: any, i: any) => { console.log(d); return x(d.date)} )
                .attr('cy', (d: any, i: any) => { console.log(d); return y(d.value)})
                .attr('r','1px')
                .style('fill', 'red'); 
        
         


            // Add the x Axis
            gX.call(xAxis);

            // Add the y Axis
            focus.append("g")
                .call(yAxis);

            
            // Add the line2 path.
            context.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", line2);


            // Add the x2 Axis
            gX2.call(xAxis2);

            context.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, x.range());

            svg.append("rect")
                .attr("class", "zoom")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(zoom);

            

        });
    };
}