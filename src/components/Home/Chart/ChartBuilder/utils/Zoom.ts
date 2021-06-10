/* eslint-disable */

import * as d3 from 'd3';

export default class Zoom {

  constructor(data: any, x: any, y: any, gX: any, gY: any, xAxis: any, yAxis: any, width: number, extent: any, line: any, line_chart: any, focus: any) {
    this.zoom = this.createZoom(data, x, y, gX, gY, xAxis, yAxis, width, extent, line, line_chart, focus);
  }

  zoom!: any;

  createZoom = (data: any, x: any, y: any, gX: any, gY: any, xAxis: any, yAxis: any, width: number, extent: any, line: any, line_chart: any, focus: any) => {
    d3.zoom()
      .scaleExtent([1, Infinity])
      //.translateExtent([[0, 0], [width, height]])
      .translateExtent(extent)
      //.extent([[0, 0], [width, height]])
      .extent(extent)
      .on("zoom", (event: any, d: any) => {
        if (event.sourceEvent && event.sourceEvent.type === "brush") return; // ignore zoom-by-brush

        // Rescale axis on zoom
        var t = event.transform;
        gX.call(xAxis.scale(event.transform.rescaleX(x)));
        gY.call(yAxis.scale(event.transform.rescaleY(y)));


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


        //////
        ////
        // Move and rescale (doji) rect and line  on zoom
        line_chart.selectAll('.rect')
          .attr("transform", event.transform);
        line_chart.select(".line").attr("d", line);
        focus.select(".axis--x").call(xAxis); // <= ?
        //
        ////
        //////

      });
  }
}