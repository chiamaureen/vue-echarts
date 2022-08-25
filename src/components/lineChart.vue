<template>
  <div>
    <div :id="chartId" :style="{ width: width, height: height }"></div>
  </div>
</template>

<script>
export default {
  props: {
    chartId: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: "500px"
    },
    height: {
      type: String,
      default: "500px"
    },
    chartOptions: {
      type: Object,
      required: true
    },
  },
  mounted() {
    this.createChart()
  },
  methods: {
    createChart() {
      // 基於準備好的dom，初始化echarts例項
      let chart = this.$echarts.init(document.getElementById(this.chartId));
      // 指定圖表的配置項和資料
      var option = {
        title: {
          text: "一週價格走勢",
          // subtext: " ",
          // itemGap: 60
          borderWidth: 20
        },
        tooltip: {},
        legend: {
          data: ["價格"]
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "價格",
            data: [220, 202, 231, 243, 225, 220, 213],
            type: "line",
            smooth: true
          }
        ]
      }
      chart.setOption(option);
    }
  }
}
</script>