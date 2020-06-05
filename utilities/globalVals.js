import * as d3 from "d3";

export const width = 1000;
export const height = 300;
export let selectedDate = new Date(2020, 1, 1);
export let currentZoom = 1;

export const xscale = d3
  .scaleTime()
  .domain(
    d3.extent([
      new Date(selectedDate.getFullYear(), 0, 1),
      new Date(selectedDate.getFullYear(), 11, 31),
    ])
  )
  .range([0, width - 100]);
export let currentScale = null;
export const x_axis = d3.axisBottom().scale(xscale);

export const setSelectedDate = (newDate) => {
  selectedDate = newDate;
};

export const setCurrentZoom = (newZoom) => {
  currentZoom = newZoom;
};

export const setCurrentScale = (newScale) => {
  currentScale = newScale;
};
