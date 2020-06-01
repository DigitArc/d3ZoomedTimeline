import * as d3 from "d3";
import { notificationsData } from "./data/mock-data";
import {
  addMainPathLinearDef,
  rescaleLinearGradientOnZoom,
} from "./utilities/add-defs";
import { clusterBuilder } from "./utilities/cluster-builder";

export const createTimeline = (selector, onZoom, onElementClick) => {
  const clusteredData = clusterBuilder(notificationsData, 40);

  const width = 1000;
  const height = 300;
  const svgContainer = d3
    .select(selector)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${200}`)
    .attr("id", "js-svg");
  const mainSvg = d3.select("#js-svg");

  addMainPathLinearDef(mainSvg);

  const xscale = d3
    .scaleTime()
    .domain(d3.extent([new Date(2020, 0, 1), new Date(2020, 11, 31)]))
    .range([0, width - 100]);

  const pointToDateScale = d3
    .scaleLinear()
    .domain([0, 900])
    .range([new Date(2020, 0, 1), new Date(2020, 11, 31)]);
  // console.log(pointToDateScale(275));

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
      // zoom level is between 1 - 50;
      const zoomLevel = d3.event.transform.k;
      // AXIS STARTING DATE
      const axisStartDate = pointToDateScale(
        -d3.event.transform.x / d3.event.transform.k
      );
      const axisEndDate = pointToDateScale(
        -d3.event.transform.x / d3.event.transform.k +
          900 / d3.event.transform.k
      );
      onZoom(axisStartDate, axisEndDate);

      const newClusterData = clusterBuilder(notificationsData, 40 / zoomLevel);
      const new_xScale = d3.event.transform.rescaleX(xscale);
      d3.selectAll("#data-container-rect").remove();
      const newRectEls = mainSvg
        .selectAll(".rect")
        .data(newClusterData)
        .enter()
        .append("g")
        .attr("id", "data-container-rect");

      // RENDER NORMAL DATA
      newRectEls
        .append("rect")
        .filter((d) => d["type"] !== "cluster")
        .attr("x", (d) => new_xScale(d.date))
        .attr("width", 55)
        .attr("height", 16)
        .attr("y", 60)
        .attr("r", 5)
        .attr("rx", 2)
        .style("fill", "#43A0EE")
        .style("cursor", "pointer")
        .on("click", (d) => onElementClick(d));

      // RENDER CLUSTERS
      newRectEls
        .append("rect")
        .filter((d) => d["type"] === "cluster")
        .attr("x", (d) => new_xScale(d.date))
        .attr("width", 27)
        .attr("height", 27)
        .attr("y", 48)
        .attr("r", 5)
        .attr("rx", 2)
        .style("fill", "#F5B640");
      // ADD TEXT TO NORMAL DATA
      newRectEls
        .append("text")
        .filter((d) => d["type"] !== "cluster")
        .attr("x", function (d, i) {
          return new_xScale(d.date) + 10;
        })
        .attr("y", 71)
        .attr("id", "item-id-text")
        .style("font-size", "9px")
        .style("fill", "white")
        .text((d) => d.id)
        .style("cursor", "pointer")
        .on("click", (d) => onElementClick(d));

      // ADD TEXT TO CLUSTERS
      newRectEls
        .append("text")
        .filter((d) => d["type"] === "cluster")
        .attr("x", function (d, i) {
          return new_xScale(d.date) + 10;
        })
        .attr("y", 66)
        .attr("id", "item-id-text")
        .style("font-size", "14px")
        .style("fill", "white")
        .text((d) => d.children.length);

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

      // TICK CIRCLE COLOR TRANSFORMATION
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
      // TICK TEXT COLOR TRANSFORMATION
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
      // TICK LINE COLOR TRANSFORMATION
      mainSvg
        .selectAll("g .tick")
        .selectAll("line")
        .filter(function (d, i) {
          const todaysExtent = new_xScale(new Date());
          const transformAtt = this.parentNode.getAttribute("transform");
          const parentTransformationVal = +transformAtt.match(
            /[0-9]+[.][0-9]+/
          )[0];
          return parentTransformationVal <= todaysExtent ? false : true;
        })
        .style("stroke", "#afafaf");
      rescaleLinearGradientOnZoom(new_xScale);
    });
  mainSvg.call(zoom);

  const todaysEl = mainSvg
    .selectAll(".today-line")
    .data([new Date()])
    .enter()
    .append("g");

  todaysEl
    .append("rect")
    .attr("id", "todays-line")
    .attr("x", (d) => xscale(d) + 44)
    .attr("width", 2)
    .attr("height", 188)
    .attr("y", 0)
    .attr("r", 5)
    .attr("rx", 2)
    .style("fill", "#43A0EE");

  const rectEls = mainSvg
    .selectAll(".rect")
    .data(clusteredData)
    .enter()
    .append("g")
    .attr("id", "data-container-rect");

  // RENDER NORMAL DATA
  rectEls
    .append("rect")
    .filter((d) => d["type"] !== "cluster")
    .attr("x", (d) => xscale(d.date))
    .attr("width", 55)
    .attr("height", 16)
    .attr("y", 60)
    .attr("r", 5)
    .attr("rx", 2)
    .style("cursor", "pointer")
    .on("click", (d) => onElementClick(d))
    .style("fill", "#43A0EE");

  // RENDER CLUSTERS
  rectEls
    .append("rect")
    .filter((d) => d["type"] === "cluster")
    .attr("x", (d) => xscale(d.date))
    .attr("width", 27)
    .attr("height", 27)
    .attr("y", 48)
    .attr("r", 5)
    .attr("rx", 2)
    .style("fill", "#F5B640");

  // ADD TEXT TO NORMAL DATA
  rectEls
    .append("text")
    .filter((d) => d["type"] !== "cluster")
    .attr("x", function (d, i) {
      return xscale(d.date) + 10;
    })
    .attr("y", 71)
    .attr("id", "item-id-text")
    .style("font-size", "9px")
    .style("fill", "white")
    .text((d) => d.id)
    .style("cursor", "pointer")
    .on("click", (d) => onElementClick(d));

  // ADD TEXT TO CLUSTERS
  rectEls
    .append("text")
    .filter((d) => d["type"] === "cluster")
    .attr("x", function (d, i) {
      return xscale(d.date) + 10;
    })
    .attr("y", 66)
    .attr("id", "item-id-text")
    .style("font-size", "14px")
    .style("fill", "white")
    .text((d) => d.children.length);

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

  // TICK LINE COLOR TRANSFORMATION
  mainSvg
    .selectAll("g .tick")
    .selectAll("line")
    .filter(function (d, i) {
      const todaysExtent = xscale(new Date());
      const transformAtt = this.parentNode.getAttribute("transform");
      const parentTransformationVal = +transformAtt.match(/[0-9]+[.][0-9]+/)[0];
      return parentTransformationVal <= todaysExtent ? false : true;
    })
    .style("stroke", "#afafaf");
};
