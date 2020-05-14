const _dayCountBetweenDates = (date1, date2) => {
  const differenceInTime = date2 - date1;
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  return Math.abs(differenceInDays);
};

export const clusterBuilder = (data) => {
  const clusterData = [];
  for (let i = 0; i < data.length; i++) {
    const currPoint = data[i];
    const singleCluster = { type: "cluster", children: [] };
    for (let j = i + 1; j < data.length; j++) {
      if (_dayCountBetweenDates(data[j]["date"], data[i]["date"]) < 40) {
        if (!data[j]["used"]) {
          singleCluster["children"].push(data[j]);
          data[j]["used"] = true;
        }
      }
    }
    if (singleCluster.children.length) {
      if (!data[i]["used"]) {
        singleCluster.children.unshift(data[i]);
        clusterData.push(singleCluster);
      } else {
        for (let k = 0; k < singleCluster.children.length; k++) {
          singleCluster.children[k].used = false;
        }
      }
    } else {
      if (!data[i]["used"]) {
        clusterData.unshift(data[i]);
      }
    }
  }

  // ADD CLUSTER DAY
  for (let i = 0; i < clusterData.length; i++) {
    if ("type" in clusterData[i]) {
      // for (let j = 0; j < clusterData[i]["children"].length; j++) {

      // }
      const total = clusterData[i]["children"].reduce(
        (prev, curr) => prev + curr["nthDay"],
        0
      );
      // const middlePoint = total / clusterData[i]["children"].length;
      // clusterData[i].middlePoint = parseInt(middlePoint, 10);
      const middlePoint = clusterData[i]["children"][0]["date"];
      clusterData[i].middlePoint = middlePoint;
    }
  }
  return clusterData;
};
