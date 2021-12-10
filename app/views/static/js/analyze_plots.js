// based on prepared DOM, initialize echarts instance
// var transmission_strain = {{transmission_strain | tojson}}; //98
// var transmission_x = {{transmission_x | tojson}}; //98
// var  Incident_strain_rate = {{Incident_strain_rate | tojson}}; //99
// var transmission_strain_rate = {{transmission_strain_rate | tojson}}; //101
// var Incident_sample_stress = {{Incident_sample_stress | tojson}}
// var transmission_sample_stress = {{transmission_sample_stress | tojson}}
// var front_face_force = {{front_face_force | tojson}}
// var back_face_force = {{back_face_force | tojson}}
// var incident_strain = {{incident_strain | tojson}};
// var incident_x = {{incident_x | tojson}};

console.log(incident_strain);

// plot incident bar strain
var inc_strain_dom = document.getElementById("inc_strain");
var inc_strain_Chart = echarts.init(inc_strain_dom);
var inc_strain_plot = render_plots(
  incident_x,
  incident_strain,
  "Incident Bar Strain",
  "time",
  "strain"
);
inc_strain_plot && inc_strain_Chart.setOption(inc_strain_plot);

// plot transmission strain
var tran_strain_dom = document.getElementById("tran_strain");
var tran_strain_Chart = echarts.init(tran_strain_dom);
var tran_strain_plot = render_plots(
  incident_x,
  transmission_strain,
  "Transmission Bar Strain",
  "time",
  "strain"
);
tran_strain_plot && tran_strain_Chart.setOption(tran_strain_plot);

// plot stress

var inc_stress_dom = document.getElementById("inc_stress_time");
var inc_stress_Chart = echarts.init(inc_stress_dom);
var inc_stress_plot = render_plots(
  incident_x,
  sample_stress,
  "Sample Stress",
  "time",
  "stress"
);
inc_stress_plot && inc_stress_Chart.setOption(inc_stress_plot);

var tran_stress_dom = document.getElementById("tran_stress_time");
var tran_stress_Chart = echarts.init(tran_stress_dom);
var tran_stress_plot = render_plots(
  incident_x,
  transmission_stress,
  "Transmission Bar Stress",
  "time",
  "stress"
);
tran_stress_plot && tran_stress_Chart.setOption(tran_stress_plot);

// plot stress strain

// var inc_stress_strain_dom = document.getElementById("inc_stress_strain");
// var inc_stress_strain_Chart = echarts.init(inc_stress_strain_dom);
// var inc_stress_strain_mapped = zip([incident_strain, sample_stress]);
// var inc_stress_strain_plot = mapped_plots(
//   inc_stress_strain_mapped,
//   "Sample Stress vs incident Strain",
//   "strain",
//   "stress"
// );
// inc_stress_strain_plot &&
//   inc_stress_strain_Chart.setOption(inc_stress_strain_plot);

var tran_stress_strain_dom = document.getElementById("tran_stress_strain");
var tran_stress_strain_Chart = echarts.init(tran_stress_strain_dom);
var trans_stress_strain_mapped = zip([
  transmission_strain,
  transmission_stress,
]);
var tran_stress_strain_plot = mapped_plots(
  trans_stress_strain_mapped,
  "Transmssion Bar Stress vs Strain",
  "strain",
  "stress"
);
tran_stress_strain_plot &&
  tran_stress_strain_Chart.setOption(tran_stress_strain_plot);

// plot strain rate

var inc_strain_rate_dom = document.getElementById("inc_strain_rate");
var inc_strain_rate_Chart = echarts.init(inc_strain_rate_dom);
var inc_strain_rate_plot = render_plots(
  incident_x,
  strain_rate,
  "Strain Rate",
  "strain rate",
  "time"
);
inc_strain_rate_plot && inc_strain_rate_Chart.setOption(inc_strain_rate_plot);

// var tran_strain_rate_dom = document.getElementById("tran_strain_rate");
// var tran_strain_rate_Chart = echarts.init(tran_strain_rate_dom);
// var tran_strain_rate_plot = render_plots(
//   incident_x,
//   transmission_strain_rate,
//   "Transmission bar Strain Rate",
//   "strain rate",
//   "time"
// );
// tran_strain_rate_plot &&
//   tran_strain_rate_Chart.setOption(tran_strain_rate_plot);

// plot force

var inc_force_dom = document.getElementById("front_face");
var inc_force_Chart = echarts.init(inc_force_dom);
var inc_force_plot = render_plots(
  incident_x,
  front_face_force,
  "Front Face Force",
  "force",
  "time"
);
inc_force_plot && inc_force_Chart.setOption(inc_force_plot);

var tran_force_dom = document.getElementById("back_face");
var tran_force_Chart = echarts.init(tran_force_dom);
var tran_force_plot = render_plots(
  incident_x,
  back_face_force,
  "Back Face Force",
  "force",
  "time"
);
tran_force_plot && tran_force_Chart.setOption(tran_force_plot);

function zip(arrays) {
  return arrays[0].map(function (_, i) {
    return arrays.map(function (array) {
      return array[i];
    });
  });
}

function render_plots(x, y, title, xname, yname) {
  option = {
    tooltip: {
      trigger: "axis",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    title: {
      left: "center",
      text: title,
      textStyle: {
        color: "#f8f8ff",
      },
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
      iconStyle: {
        borderColor: "rgba (255,255,255)",
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        color: "#fffafa",
      },
      nameTextStyle: {
        color: "#fffafa",
        padding: [8, 8, 8, 8],
        fontWeight: "bold",
      },
      name: xname,
      nameLocation: "middle",

      data: x,
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "100%"],
      axisLabel: {
        color: "#fffafa",
      },
      nameTextStyle: {
        color: "#fffafa",
        fontWeight: "bold",
        padding: [0, 0, 20, 0],
      },
      name: yname,
      nameLocation: "middle",
      nameGap: 25,
    },

    series: [
      {
        name: title,
        type: "line",
        symbol: "none",
        sampling: "lttb",
        itemStyle: {
          color: "rgb(255, 70, 131)",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(255, 158, 68)",
            },
            {
              offset: 1,
              color: "rgb(255, 70, 131)",
            },
          ]),
        },
        data: y,
      },
    ],
  };

  return option;
}

function mapped_plots(mapped, title, xname, yname) {
  option = {
    tooltip: {
      trigger: "axis",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    title: {
      left: "center",
      text: title,
      textStyle: {
        color: "#f8f8ff",
      },
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
      iconStyle: {
        borderColor: "rgba (255,255,255)",
      },
    },
    xAxis: {
      type: "value",
      boundaryGap: false,
      axisLabel: {
        color: "#fffafa",
      },
      nameTextStyle: {
        color: "#fffafa",
        padding: [8, 8, 8, 8],
        fontWeight: "bold",
      },
      name: xname,
      nameLocation: "middle",
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "100%"],
      axisLabel: {
        color: "#fffafa",
      },
      nameTextStyle: {
        color: "#fffafa",
        fontWeight: "bold",
        padding: [0, 0, 20, 0],
      },
      name: yname,
      nameLocation: "middle",
      nameGap: 25,
    },

    series: [
      {
        name: title,
        type: "line",
        symbol: "none",
        sampling: "lttb",
        itemStyle: {
          color: "rgb(255, 70, 131)",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgb(255, 158, 68)",
            },
            {
              offset: 1,
              color: "rgb(255, 70, 131)",
            },
          ]),
        },
        data: mapped,
      },
    ],
  };

  return option;
}
