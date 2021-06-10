/* eslint-disable */

import * as d3 from 'd3';
import Axis from "./Axis";

export default class Brush {

  constructor(svg: any, data: any, parseTime: any, zoom: any, width: number, height: number, width2: number, height2: number, axisInstance: Axis) {
    this.brush = this.createBrush(svg, data, parseTime, zoom, width, height, width2, height2, axisInstance);
  }

  brush!: any;

  createBrush(svg: any, data: any, parseTime: any, zoom: any, width: number, height: number, width2: number, height2: number, axisInstance: Axis) {
    this.brush = d3.brushX()
      .extent([[0, 0], [width, height2]])
      .on("brush end", (event: any, d: any) => {
        if (event.sourceEvent && event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom

        const s = event.selection || axisInstance.x2.range();

        // return start / end date of the range
        const rangeDate = s.map(axisInstance.x2.invert, axisInstance.x2);
        console.log("rangeDate", rangeDate)
        // x.domain(rangeDate);

        var output = data
          .filter((d: any) => rangeDate[0] < parseTime(d.snapshotTime) && rangeDate[1] > parseTime(d.snapshotTime))
          .map((d: any) => d.value);

        console.log("filter/map array: " + output);
        console.log("min: " + d3.min(output));
        console.log("max: " + d3.max(output));
        console.log("Y2 INVERT: " + axisInstance.y);
        console.log("HEIGHT :", height);

        const yMin = axisInstance.y(d3.min(output));
        const yMax = axisInstance.y(d3.max(output));
        console.log("Y MIN :", yMin);
        console.log("Y MAX: ", yMax);
        console.log("Y MAX - Y MIN : ", (yMax - yMin));
        console.log("HEIGHT - (Y MAX - Y MIN) : ", (height - (yMax - yMin)));
        console.log("Y invert MAX - Y invert MIN: ", (axisInstance.y.invert(yMax) - axisInstance.y.invert(yMin)));
        console.log("CENTRE  ", yMin + ((yMax - yMin) / 2));
        console.log("CENTRE  ", axisInstance.y.invert(yMin + ((yMax - yMin) / 2)));

        svg.select(".zoom")
          .call(zoom.transform,
            d3.zoomIdentity
              .translate(-s[0], 0)
              .scale((width / (s[1] - s[0])))
          );

        //svg.select(".zoom")
        //    .call(zoom.transform,
        //        d3.zoomIdentity
        //            .translate(-s[0], 0)
        //        //.scale((width / (s[1] - s[0])))
        //    );

        // y.domain([
        //     d3.min(output),
        //     d3.max(output)]
        // );


      });





  }
}