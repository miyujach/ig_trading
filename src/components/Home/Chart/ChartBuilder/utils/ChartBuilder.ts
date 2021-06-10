/* eslint-disable */

import * as d3 from 'd3';
import Axis from './Axis';
import Zoom from './Zoom';
import Line from './Line';

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

        // Get the data
        //d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv").then(function(data: any) {
        data = data.prices;

        // format the data
        data.forEach((d: any) => {
            d.date = parseTime(d.snapshotTime);
            d.value = +d.openPrice.bid;
        });

        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        const axisInstance = new Axis(svg, data, focus, width, height, width2, height2, margin2, parseTime);
        const lineInstance = new Line(svg, data, margin, axisInstance.x, axisInstance.y, axisInstance.x2, axisInstance.y2, width, height);
        var extent = [
            [margin.left, margin.top],
            [width - margin.right, height - margin.top]
        ];
        const zoomInstance = new Zoom(data, axisInstance.x, axisInstance.y, axisInstance.gX, axisInstance.gY, axisInstance.xAxis, axisInstance.yAxis, width, extent, lineInstance.line, lineInstance.line_chart, focus);










        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var chart = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");












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



        let boxWidth = 0;
        if (data.length > 2) {
            boxWidth = (axisInstance.x(data[1].date) - axisInstance.x(data[0].date)) / 2;
        } else {
            boxWidth = width;
        }
        lineInstance.line_chart
            .selectAll("boxes")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d: any, i: any) => {
                return (axisInstance.x(d.date) - boxWidth / 2)
            })
            .attr("y", (d: any) => {
                if (axisInstance.y(d.openPrice.bid) - axisInstance.y(d.closePrice.bid) > 0) {
                    return (axisInstance.y(d.openPrice.bid) - Math.abs(axisInstance.y(d.openPrice.bid) - axisInstance.y(d.closePrice.bid)))
                }
                return (axisInstance.y(d.openPrice.bid))
            })
            .attr("height", (d: any) => {
                // Le point initial de la hauteur se situe en haut. Quand la valeur augmente, la hauteur du rectangle augmente vers le bas et inversement.
                // Quand la valeur et positive (donc que la bougie et verte, alors la hauteur du rectangle doit augmenter vers le haut)
                // Quand la valeur et négative (donc que la bougie et rouge, alors la hauteur du rectangle doit augmenter vers le bas)

                // La valeur de la hauteur est obligatoirement positive, quand la valeur augmente on doit donc décaler le rectangle vers le haut en bougeant la valeur de Y.

                return (Math.abs(axisInstance.y(d.openPrice.bid) - axisInstance.y(d.closePrice.bid)))
            })
            .attr("width", (d: any, i: number) => {
                return boxWidth;
            })
            .attr("class", "rect")
            .attr("stroke", "black")
            .style("fill", (d: any) => {
                if (axisInstance.y(d.openPrice.bid) - axisInstance.y(d.closePrice.bid) > 0) {
                    return "#69b3a2";
                } else {
                    return "#DC143C";
                }
            })









        const zoomer = svg.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoomInstance.zoom);
        //zoomer.call(zoom.transform, d3.zoomIdentity.translate(150, 0))



        // });
    };
}