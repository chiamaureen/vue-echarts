<template>
  <v-container>
    <div id="mapChart" :style="{ width: '1000px', height: '600px' }"></div>
  </v-container>
</template>

<script>
import TJson from "../assets/Taiwan.json";
import mapData from '../assets/load_map_data';

export default {
  props: {},
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      let mapChart = this.$echarts.init(document.getElementById("mapChart"));
      this.$echarts.registerMap("Taiwan", TJson);

      const option = {
        title: {
          text: "Taiwan Map",
          // subtext: "Data from Wikipedia",
          // sublink: "",
        },
        // tooltip: {
        //   trigger: "item",
        //   formatter: "{b}<br/>{c} (p / km2)",
        // },
      //   toolbox: {
      //     show: true,
      //     orient: "vertical",
      //     left: "right",
      //     top: "center",
      //     feature: {
      //       dataView: { readOnly: false },
      //       restore: {},
      //       saveAsImage: {},
      //     },
      //   },
        visualMap: {
          min: 0,
          max: 20,
          text: ["High", "Low"],
          realtime: false,
          calculable: true,
          inRange: {
            color: ["lightskyblue", "yellow", "orangered"],
          },
        },
        series: [
            {
              name: "台灣地圖",
              type: "map",
              map: "Taiwan",
              silent: false, // hover地圖的變化
              emphasis: { // hover地圖的變化的設定
                itemStyle: {
                  areaColor: 'none'
                },
                label: {
                  show: true,
                },
              },
              select: { // 地圖點選後的變化的設定
                disabled: false, // 能不能點選地圖
                itemStyle: {
                  areaColor: 'steelblue'
                },
              },
              label: { // 地圖上要不要顯示區域名稱
                show: true,
              },
            data: mapData.data[0],
            }
        ],
      };
      mapChart.setOption(option);
    },
  },
};
</script>
