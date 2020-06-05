import * as d3 from "d3";
import {
  width,
  height,
  xscale,
  x_axis,
  setSelectedDate,
  currentScale,
} from "./globalVals";
import { styleAxis } from "./styleAxis";
import { clusterBuilder } from "./cluster-builder";
import { notificationsData } from "../data/mock-data";

let num = 2016;
function* iter(i) {
  num++;
  yield num + 1;
}

const handleButtonClick = (e) => {
  const iterNum = iter().next();
  setSelectedDate(new Date(iterNum.value, 0, 1));
  xscale.domain(
    d3.extent([new Date(iterNum.value, 0, 1), new Date(iterNum.value, 11, 31)])
  );
  const svg = d3.select("body").transition();
  if (currentScale) {
    const newXScale = currentScale.rescaleX(xscale);
    svg.select(".x.axis").call(d3.axisBottom().scale(newXScale));

    d3.selectAll("#data-container-rect").remove();
    const newClusterData = clusterBuilder(
      notificationsData,
      currentScale ? 40 / currentScale.k : 40
    );
    const newRectEls = d3
      .select("#js-svg")
      .selectAll(".rect")
      .data(newClusterData)
      .enter()
      .append("g")
      .attr("id", "data-container-rect");

    // RENDER NORMAL DATA
    newRectEls
      .append("rect")
      .filter((d) => d["type"] !== "cluster")
      .attr("x", (d) => newXScale(d.date))
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
      .attr("x", (d) => newXScale(d.date))
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
        return newXScale(d.date) + 10;
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
        return newXScale(d.date) + 10;
      })
      .attr("y", 66)
      .attr("id", "item-id-text")
      .style("font-size", "14px")
      .style("fill", "white")
      .text((d) => d.children.length);

    styleAxis(d3.select("#js-svg"), newXScale);

    d3.select("#js-svg")
      .selectAll("#todays-line")
      .attr("x", (d) => newXScale(d) + 44);
  } else {
    svg.select(".x.axis").call(d3.axisBottom().scale(xscale));

    d3.selectAll("#data-container-rect").remove();
    const newClusterData = clusterBuilder(
      notificationsData,
      currentScale ? 40 / currentScale.k : 40
    );
    const newRectEls = d3
      .select("#js-svg")
      .selectAll(".rect")
      .data(newClusterData)
      .enter()
      .append("g")
      .attr("id", "data-container-rect");

    // RENDER NORMAL DATA
    newRectEls
      .append("rect")
      .filter((d) => d["type"] !== "cluster")
      .attr("x", (d) => xscale(d.date))
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
      .attr("x", (d) => xscale(d.date))
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
    newRectEls
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

    styleAxis(d3.select("#js-svg"), xscale);

    d3.select("#js-svg")
      .selectAll("#todays-line")
      .attr("x", (d) => xscale(d) + 44);
  }
};

export const handleDateChange = (e) => {
  const changeButton = document.querySelector("#changebutton");
  changeButton.addEventListener("click", handleButtonClick);
};
