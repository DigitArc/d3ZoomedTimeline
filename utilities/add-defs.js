import * as d3 from "d3";

const xscaleGradient = d3
  .scaleTime()
  .domain(d3.extent([new Date(2020, 0, 1), new Date(2020, 11, 31)]))
  .range([0, 1]);

export const addMainPathLinearDef = (mainSvg) => {
  const mainDef = mainSvg.append("defs");
  const linearGradientDef = mainDef
    .append("linearGradient")
    .attr("id", "main-path-gradient")
    .attr("y1", 1.5)
    .attr("x2", 880)
    .attr("y2", 1.5)
    .attr("gradientUnits", "userSpaceOnUse");
  linearGradientDef
    .append("stop")
    .attr("offset", 0)
    .attr("stop-color", "#43a0ee");
  linearGradientDef
    .append("stop")
    .attr("id", "linear-first-point")
    .attr("offset", xscaleGradient(new Date()))
    .attr("stop-color", "#43a0ee");
  linearGradientDef
    .append("stop")
    .attr("id", "linear-second-point")
    .attr("offset", xscaleGradient(new Date()) + 0.01)
    .attr("stop-color", "#afafaf");
};

export const rescaleLinearGradientOnZoom = (new_xScale) => {
  const interpolatedStopPoint = d3.scaleLinear().domain([0, 900]).range([0, 1]);
  const result = interpolatedStopPoint(new_xScale(new Date()));
  d3.selectAll("#linear-first-point").attr("offset", result);
  d3.selectAll("#linear-second-point").attr("offset", result + 0.01);
};
