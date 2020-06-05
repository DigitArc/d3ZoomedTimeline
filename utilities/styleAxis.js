import { rescaleLinearGradientOnZoom } from "./add-defs";

export const styleAxis = (mainSvg, xscale) => {
  mainSvg
    .selectAll("g .tick")
    .selectAll("line")
    .attr("stroke", "#43A0EE")
    .style("opacity", 0)
    .transition()
    .duration(400)
    .style("opacity", 0.4)
    .attr("y2", 100)
    .attr("y1", -100);

  mainSvg
    .selectAll("g .tick")
    .append("circle")
    .style("fill", "#43A0EE")
    .attr("r", 0)
    .transition()
    .duration(600)
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
      // const todaysExtent = xscale(new Date());
      return d <= new Date() ? false : true;
      // const transformAtt = this.parentNode.getAttribute("transform");
      // const parentTransformationVal = +transformAtt.match(/[0-9]+[.][0-9]+/)[0];
      // return parentTransformationVal <= todaysExtent ? false : true;
    })
    .style("fill", "#afafaf");

  // TEXT COLOR TRANSFORMATION
  mainSvg
    .selectAll("g .tick")
    .selectAll("text")
    .filter(function (d, i) {
      return d <= new Date() ? false : true;
      // const todaysExtent = xscale(new Date());
      // const transformAtt = this.parentNode.getAttribute("transform");
      // const parentTransformationVal = +transformAtt.match(/[0-9]+[.][0-9]+/)[0];
      // return parentTransformationVal <= todaysExtent ? false : true;
    })
    .style("fill", "#afafaf");

  // TICK LINE COLOR TRANSFORMATION
  mainSvg
    .selectAll("g .tick")
    .selectAll("line")
    .filter(function (d, i) {
      return d <= new Date() ? false : true;
      // const todaysExtent = xscale(new Date());
      // const transformAtt = this.parentNode.getAttribute("transform");
      // const parentTransformationVal = +transformAtt.match(/[0-9]+[.][0-9]+/)[0];
      // return parentTransformationVal <= todaysExtent ? false : true;
    })
    .style("stroke", "#afafaf");
  rescaleLinearGradientOnZoom(xscale);
};
