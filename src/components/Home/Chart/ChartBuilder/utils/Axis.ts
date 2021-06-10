/* eslint-disable */

import * as d3 from 'd3';
import Brush from './Brush';
import moment from 'moment';

export default class Axis {

  constructor(svg: any, data: any, focus: any, width: number, height: number, width2: number, height2: number, margin2: any, parseTime: any) {
    this.createAxis(svg, data, width, focus, height, width2, height2, margin2);
    this.createDomain(data, this.x, this.y, this.x2, this.y2, moment);
    this.createBrush(svg, data, parseTime, width, height, width2, height2, this);
  }
  // set the ranges
  x!: any;
  y!: any;
  x2!: any;
  y2!: any;
  xAxis!: any;
  xAxis2!: any;
  yAxis!: any;
  gX!: any;
  gY!: any;
  gX2!: any;
  context!: any;
  zoomX!: any;
  zoomY!: any;
  line2!: any;



  createAxis = (svg: any, data: any, width: number, focus: any, height: number, width2: number, height2: number, margin2: any) => {
    this.x = d3.scaleTime().range([0, width]);
    this.y = d3.scaleLinear().range([height, 0]);
    this.x2 = d3.scaleTime().range([0, width2]);
    this.y2 = d3.scaleLinear().range([height2, 0]);

    this.xAxis = d3.axisBottom(this.x);
    this.xAxis2 = d3.axisBottom(this.x2);
    this.yAxis = d3.axisLeft(this.y);

    this.context = svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



    this.line2 = d3.line()
      .x((d: any) => this.x2(d.date))
      .y((d: any) => this.y2(d.value));

    // Add the line2 path.
    this.context.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", this.line2);


    this.gX2 = this.context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")");

    this.zoomX = d3.zoom().scaleExtent([1, Infinity]);
    this.zoomY = d3.zoom().scaleExtent([1, Infinity]);

    this.gX = focus.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(this.zoomX)
      .attr("pointer-events", "none");

    this.gY = focus.append("g")
      .call(this.zoomY)
      .attr("pointer-events", "none");

    // Add the x Axis
    this.gX.call(this.xAxis);

    // Add the y Axis
    this.gY.call(this.yAxis)
      .attr("transform", "translate(" + width + ", 0)");
    // Add the x2 Axis
    this.gX2.call(this.xAxis2);
  }

  createDomain = (data: any, x: any, y: any, x2: any, y2: any, moment: any) => {
    // Scale the range of the data
    x.domain(d3.extent(data, (d: any, i: number) => {
      if (i == 0) {
        // On soustrait 15 min
        return moment(d.snapshotTime).subtract(10, "minutes").toDate();
      } else if (data.length == i + 1) {
        // On ajoute 15 min
        return moment(d.snapshotTime).add(10, "minutes").toDate();
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
  }

  createBrush = (svg: any, data: any, parseTime: any, width: any, height: any, width2: any, height2: any, axisInstance: Axis) => {
    const brushInstance = new Brush(svg, data, parseTime, d3.zoom(), width, height, width2, height2, axisInstance);
    //this.context.append("g")
    //  .attr("class", "brush")
    //  .call(brushInstance.brush)
    //  .call(brushInstance.brush.move, axisInstance.x.range());
  }

}