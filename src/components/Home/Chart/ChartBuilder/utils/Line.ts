/* eslint-disable */

import * as d3 from 'd3';

export default class Line {

  constructor(svg: any, data: any, margin: any, x: any, y: any, x2: any, y2: any, width: any, height: any) {
    this.createLine(svg, data, margin, x, y, x2, y2, width, height);
  }

  line!: any;
  clip!: any;
  line_chart!: any;


  createLine = (svg: any, data: any, margin: any, x: any, y: any, x2: any, y2: any, width: any, height: any) => {
    // define the line
    this.line = d3.line()
      .x(function (d: any) { return x(d.date); })
      .y(function (d: any) { return y(d.value); });



    this.clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    this.line_chart = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("clip-path", "url(#clip)");

    this.line_chart
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
  }
}