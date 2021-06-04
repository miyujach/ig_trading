/* eslint-disable */

import * as d3 from 'd3';
import moment from 'moment';

export class ChartBuilder {
    constructor(document: any, data: any) {
        this.init(document, data);
    }

    //function
    init = (document: any, data: any) => {
        // set the dimensions and margins of the graph
        var svg = d3.select("#ig-trading-chart");
        const elem = document.getElementById('ig-trading-chart');
        console.log('elem ', elem.clientHeight)
        const svgWidth = elem.clientWidth;
        const svgHeight = elem.clientHeight;


        var margin = { top: 20, right: 20, bottom: 130, left: 40 },
            width = svgWidth - margin.left - margin.right,
            height = svgHeight - margin.top - margin.bottom;

        var margin2 = { top: svgHeight - 100, right: 20, bottom: 50, left: 40 },
            width2 = svgWidth - margin2.left - margin2.right,
            height2 = svgHeight - margin2.top - margin2.bottom;

        // parse the date / time
        var parseTime = d3.timeParse("%Y/%m/%d %H:%M:%S");
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
                y.domain(s.map(y.invert, y));


                // line_chart.select(".line").attr("d", line);
                // focus.select(".axis--x").call(xAxis);

                svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                    .scale(width / (s[1] - s[0]))
                    .translate(-s[0], 0));
            });

        var extent = [
            [margin.left, margin.top],
            [width - margin.right, height - margin.top]
        ];

        const zoomX = d3.zoom().scaleExtent([1, Infinity])
        const zoomY = d3.zoom().scaleExtent([1, Infinity])

        var zoom: any = d3.zoom()
            .scaleExtent([1, Infinity])
            //.translateExtent([[0, 0], [width, height]])
            .translateExtent(extent)
            //.extent([[0, 0], [width, height]])
            .extent(extent)
            .on("zoom", (event: any, d: any) => {
                if (event.sourceEvent && event.sourceEvent.type === "brush") return; // ignore zoom-by-brush

                var t = event.transform;
                gX.call(xAxis.scale(event.transform.rescaleX(x)));


                // move dot on zoom
                line_chart.selectAll('.dot')
                    .attr("cx", (d: any) => { return x(d.date) })
                    .attr("cy", (d: any) => { return y(d.value); });

                // move vertical line on zoom
                line_chart.selectAll('.vertical-line')
                    //.attr("x1", (d: any) => {return(x(d.date))})
                    //.attr("x2", (d: any) => {return(x(d.date))})
                    //.attr("y1", (d: any) => {return(y(d.lowPrice.bid))}) // min
                    //.attr("y2", (d: any) => {return(y(d.highPrice.bid))}) // max
                    .attr("transform", event.transform)

                let boxWidth = 0;
                if (data.length > 2) {
                    boxWidth = (x(data[1].date) - x(data[0].date)) / 2;
                } else {
                    boxWidth = width;
                }
                // move and rescale rect on zoom
                line_chart.selectAll('.rect')

                    .attr("transform", event.transform);
                //.attr("x", (d: any, i: any) => {
                //    return(x(d.date)-boxWidth/2)
                //})
                //.attr("width", (d: any, i: number) => {
                //    return boxWidth; 
                //})

                line_chart.select(".line").attr("d", line);
                focus.select(".axis--x").call(xAxis);
            });


        // define the line
        var line = d3.line()
            .x(function (d: any) { return x(d.date); })
            .y(function (d: any) { return y(d.value); });

        var line2 = d3.line()
            .x(function (d: any) { return x2(d.date); })
            .y(function (d: any) { return y2(d.value); });

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
            .attr("transform", "translate(0," + height + ")")
            .call(zoomX).attr("pointer-events", "none");

        var gY = focus.append("g")
            .call(zoomY).attr("pointer-events", "none");

        var gX2 = context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")");


        // Get the data
        //d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv").then(function(data: any) {
        data = data.prices;

        // format the data
        data.forEach((d: any) => {
            d.date = parseTime(d.snapshotTime);
            d.value = +d.openPrice.bid;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, (d: any, i: number) => {
            if (i == 0) {
                // On soustrait 15 min
                return moment(d.snapshotTime).subtract(5, "minutes").toDate();
            } else if (data.length == i + 1) {
                // On ajoute 15 min
                return moment(d.snapshotTime).add(5, "minutes").toDate();
            }
            return d.date;
        }));
        y.domain([
            d3.min(data, function (d: any) { return d.lowPrice.bid; }),
            d3.max(data, function (d: any) { return d.highPrice.bid; })]
        );
        // y.domain([0, d3.max(data, function(d: any) { return d.value; })]);

        x2.domain(x.domain());
        y2.domain(y.domain());

        // Add the line path.
        // line_chart.append("path")
        //     .data([data])
        //     .attr("class", "line")
        //     .attr("d", line);

        // Add the circlle to the path.
        // line_chart
        //     .selectAll('.circle')
        //     .data(data)
        //     .enter()
        //     .append('circle')
        //     .attr('class', 'dot')
        //     .attr('cx', (d: any, i: any) => { console.log(d); return x(d.date)} )
        //     .attr('cy', (d: any, i: any) => { console.log(d); return y(d.value)})
        //     .attr('r','1px')
        //     .style('fill', 'red'); 

        line_chart
            .selectAll("vertLines")
            .data(data)
            .enter()
            .append("line")
            .attr('class', 'vertical-line')
            .attr("x1", (d: any) => { return (x(d.date)) })
            .attr("x2", (d: any) => { return (x(d.date)) })
            .attr("y1", (d: any) => { return (y(d.lowPrice.bid)) }) // min
            .attr("y2", (d: any) => { return (y(d.highPrice.bid)) }) // max
            .attr("stroke", "black")
            .style("width", 40)

        let boxWidth = 0;
        if (data.length > 2) {
            boxWidth = (x(data[1].date) - x(data[0].date)) / 2;
        } else {
            boxWidth = width;
        }
        line_chart
            .selectAll("boxes")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d: any, i: any) => {
                return (x(d.date) - boxWidth / 2)
            })
            .attr("y", (d: any) => {
                if (y(d.openPrice.bid) - y(d.closePrice.bid) > 0) {
                    return (y(d.openPrice.bid) - Math.abs(y(d.openPrice.bid) - y(d.closePrice.bid)))
                }
                return (y(d.openPrice.bid))
            })
            .attr("height", (d: any) => {
                // Le point initial de la hauteur se situe en haut. Quand la valeur augmente, la hauteur du rectangle augmente vers le bas et inversement.
                // Quand la valeur et positive (donc que la bougie et verte, alors la hauteur du rectangle doit augmenter vers le haut)
                // Quand la valeur et négative (donc que la bougie et rouge, alors la hauteur du rectangle doit augmenter vers le bas)

                // La valeur de la hauteur est obligatoirement positive, quand la valeur augmente on doit donc décaler le rectangle vers le haut en bougeant la valeur de Y.

                return (Math.abs(y(d.openPrice.bid) - y(d.closePrice.bid)))
            })
            .attr("width", (d: any, i: number) => {
                return boxWidth;
            })
            .attr("class", "rect")
            .attr("stroke", "black")
            .style("fill", (d: any) => {
                if (y(d.openPrice.bid) - y(d.closePrice.bid) > 0) {
                    return "#69b3a2";
                } else {
                    return "#DC143C";
                }
            })




        // Add the x Axis
        gX.call(xAxis);

        // Add the y Axis
        gY.call(yAxis);


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



        // });
    };
}