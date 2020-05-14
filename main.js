import * as d3 from "d3";
import { notificationsData } from "./data/mock-data";
import {
  addMainPathLinearDef,
  rescaleLinearGradientOnZoom,
} from "./utilities/add-defs";
import { clusterBuilder } from "./utilities/cluster-builder";

const width = 1000;
const height = 500;
const svgContainer = d3
  .select("#container")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("id", "js-svg");
const mainSvg = d3.select("#js-svg");

addMainPathLinearDef(mainSvg);

const data = [100, 150, 200, 250, 280, 300];
const xscale = d3
  .scaleTime()
  .domain(d3.extent([new Date(2020, 0, 1), new Date(2020, 11, 31)]))
  .range([0, width - 100]);

const x_axis = d3.axisBottom().scale(xscale);

const xAxisTranslate = height / 3.5;
const gX = mainSvg
  .append("g")
  .attr("transform", "translate(50, " + xAxisTranslate + ")")
  .call(x_axis);

const zoom = d3
  .zoom()
  .translateExtent([
    [0, 0],
    [width, height],
  ])
  .scaleExtent([1, 50])
  .on("zoom", () => {
    const new_xScale = d3.event.transform.rescaleX(xscale);
    gX.call(x_axis.scale(new_xScale));

    mainSvg.selectAll("rect").attr("x", (d) => new_xScale(d.date));
    mainSvg
      .selectAll("#item-id-text")
      .attr("x", (d) => new_xScale(d.date) + 10);
    mainSvg
      .selectAll("g .tick")
      .selectAll("line")
      .style("opacity", 0.4)
      .attr("stroke", "#43A0EE")
      .attr("y2", 100)
      .attr("y1", -100);
    mainSvg
      .selectAll("g .tick")
      .append("circle")
      .style("fill", "#43A0EE")
      .attr("r", 3.5);

    mainSvg
      .selectAll("g .tick")
      .selectAll("text")
      .style("fill", "#43A0EE")
      .style("font-size", "8px");
    mainSvg.selectAll("#todays-line").attr("x", (d) => new_xScale(d) + 44);

    // CIRCLE COLOR TRANSFORMATION
    mainSvg
      .selectAll("circle")
      .filter(function (d, i) {
        const todaysExtent = new_xScale(new Date());
        const transformAtt = this.parentNode.getAttribute("transform");
        const parentTransformationVal = +transformAtt.match(
          /[0-9]+[.][0-9]+/
        )[0];
        return parentTransformationVal <= todaysExtent ? false : true;
      })
      .style("fill", "#afafaf");
    mainSvg
      .selectAll("g .tick")
      .selectAll("text")
      .filter(function (d, i) {
        const todaysExtent = new_xScale(new Date());
        const transformAtt = this.parentNode.getAttribute("transform");
        const parentTransformationVal = +transformAtt.match(
          /[0-9]+[.][0-9]+/
        )[0];
        return parentTransformationVal <= todaysExtent ? false : true;
      })
      .style("fill", "#afafaf");
    rescaleLinearGradientOnZoom(new_xScale);
  });
mainSvg.call(zoom);

const todaysEl = mainSvg
  .selectAll(".today-line")
  .data([new Date()])
  .enter()
  .append("g");

// console.log(xscale(new Date()));
todaysEl
  .append("rect")
  .attr("id", "todays-line")
  .attr("x", (d) => xscale(d) + 44)
  .attr("width", 2)
  .attr("height", 200)
  .attr("y", 43)
  .attr("r", 5)
  .attr("rx", 2)
  .style("fill", "#43A0EE");

const rectEls = mainSvg
  .selectAll(".rect")
  .data(notificationsData)
  .enter()
  .append("g");

rectEls
  .append("rect")
  .attr("x", (d) => xscale(d.date))
  .attr("width", 55)
  .attr("height", 16)
  .attr("y", 120)
  .attr("r", 5)
  .attr("rx", 2)
  .style("fill", "#43A0EE");

rectEls
  .append("text")
  .attr("x", function (d, i) {
    return xscale(d.date) + 10;
  })
  .attr("y", 131)
  .attr("id", "item-id-text")
  .style("font-size", "9px")
  .style("fill", "white")
  .text((d) => d.id);

mainSvg
  .selectAll("g .tick")
  .selectAll("line")
  .attr("stroke", "#43A0EE")
  .style("opacity", 0.4)
  .attr("y2", 100)
  .attr("y1", -100);

mainSvg
  .selectAll("g .tick")
  .append("circle")
  .style("fill", "#43A0EE")
  .attr("r", 3.5);

mainSvg
  .selectAll("g .tick")
  .selectAll("text")
  .style("fill", "#43A0EE")
  .style("font-size", "8px");

mainSvg.selectAll(".domain").attr("stroke", "url(#main-path-gradient)");

// CIRCLE COLOR TRANSFORMATION
mainSvg
  .selectAll("circle")
  .filter(function (d, i) {
    const todaysExtent = xscale(new Date());
    const transformAtt = this.parentNode.getAttribute("transform");
    const parentTransformationVal = +transformAtt.match(/[0-9]+[.][0-9]+/)[0];
    return parentTransformationVal <= todaysExtent ? false : true;
  })
  .style("fill", "#afafaf");

// TEXT COLOR TRANSFORMATION
mainSvg
  .selectAll("g .tick")
  .selectAll("text")
  .filter(function (d, i) {
    const todaysExtent = xscale(new Date());
    const transformAtt = this.parentNode.getAttribute("transform");
    const parentTransformationVal = +transformAtt.match(/[0-9]+[.][0-9]+/)[0];
    return parentTransformationVal <= todaysExtent ? false : true;
  })
  .style("fill", "#afafaf");

console.log(clusterBuilder(notificationsData));
