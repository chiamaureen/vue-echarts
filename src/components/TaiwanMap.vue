<template>
  <v-container>
    <div id="county_map_chart" :style="{ width: '1000px', height: '600px' }"></div>
  </v-container>
</template>

<script>
import TJson from "../assets/cTaiwan.json";
// import ctaiwan from "../assets/town";
import mapData from '../assets/load_map_data';

export default {
  props: {},
  mounted() {
    this.taiwan_county_chart();
  },
  methods: {
    taiwan_county_chart() {
      let county_map_chart = this.$echarts.init(document.getElementById("county_map_chart"));
      this.$echarts.registerMap("taiwan", TJson);

      const option = {
        title: {
          text: "Taiwan Map",
          // subtext: "Data from Wikipedia",
          // sublink: "",
        },
        // visualMap: { // color bar
        //   min: 0,
        //   max: 20,
        //   text: ["High", "Low"],
        //   realtime: false,
        //   calculable: true,
        //   inRange: {
        //     color: ["lightskyblue", "yellow", "orangered"],
        //   },
        // },
        series: [
          {
            name: "台灣地圖",
            type: "map", // 必要的
            map: "taiwan", // 必要的
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
            roam: true, // 地圖可以平移及縮放
            boundingCoords:[ [118,26.5], [122.4,21.5] ],
            center: [120.3, 23.8],
            layoutCenter: ['50%', '50%'],
            left: '5%', 
            aspectScale:1,
            scaleLimit: { min: 1, max: 12.0 },
          }
        ],
      };
      county_map_chart.setOption(option);

      county_map_chart.on('click', (item) => {console.log(item.name)});

    },
  },
};
</script>
