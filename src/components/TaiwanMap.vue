<template>
    <v-container>
        <div 
          id="taiwan_map_chart" 
          class="chart-area"
          :class="{'hide-map': hide_taiwan_map}"
        ></div>
        <div 
          id="county_detail_chart" 
          class="chart-area"
          :class="{'hide-map': hide_county_map}"
        ></div>
    </v-container>
</template>

<script>
import TJson from "../assets/cTaiwan.json";
// import map_data from '../assets/load_map_data';
import map_data_town from '../assets/load_map_data_town';
import { town_to_county } from '../assets/county_town_table';
import { Citymap_All } from '../assets/citymap_All.js';

export default {
  
  mounted() {
    this.taiwan_county_chart();
  },

  data() {
    return {
      map_appendix_City: {
        "連江縣邊框": {"left": 119.17, "top": 24.76, "width": 0.55,"height":0.8},
        "金門縣邊框": {"left": 119.17, "top": 24.08, "width": 0.7,"height":0.6},
        "連江縣": { "width": 1.22, "left": 119.336, "top": 24.8 },
        "金門縣": { "width": 2, "left": 119.249, "top": 24.16 }
      },
      target_county: '',
      hide_taiwan_map: false,
      hide_county_map: false,
    }
  },

  methods: {
    taiwan_county_chart () {
      let county_map_chart = this.$echarts.init(document.getElementById("taiwan_map_chart"));
      this.$echarts.registerMap("taiwan", TJson, this.map_appendix_City);

      const option = {
        title: {
          text: "Taiwan Map",
        },
        visualMap: {
          type: 'piecewise',
          itemGap: 0,
          itemSymbol: 'rect',
          splitNumber: 18,
          min: 0,
          max: 17,
          text: ["17", "0"],
          realtime: false,
          // calculable: true,
          inRange: {
              color: ['#a9a9a9', '#ffffff', '#ffffff', '#ffffff', '#e0ffff', '#7fffd4', '#ffff00', '#ffa500', '#ff0000', '#ff0000', '#ff00ff', '#ff00ff', '#4b0082', '#4b0082', '#4b0082', '#4b0082', '#4b0082', '#4b0082', '#4b0082']
          },
        },
        series: [{
            type: 'map', // 必填
            map: 'taiwan', // 必填
            roam: true,
            boundingCoords:[ [118,26.5], [122.4,21.5] ],
            center: [120.3, 23.8],
            layoutCenter: ['50%', '50%'],
            aspectScale: 1,
            scaleLimit: { min: 1.4, max: 12.0 },
            left: '0%', 
            itemStyle:{
                areaColor: 'none',
                borderColor : '#999',
                borderWidth: 1,  
            },
            emphasis: {
                shadowColor: 'lightgrey', 
                shadowBlur: 3,
                borderWidth: 3,
                borderColor: 'grey',
                areaColor: 'none',
                label: {
                    show: true,
                    color: '#333'
                },
                itemStyle:{
                    areaColor: 'none',
                    borderColor : '#999',
                    borderWidth: 1,  
                },
            },
            label: {
                // show: true,
            },
            select:{
                label: {
                    show: true
                },
                itemStyle: function(val){
                    return val;
                }
            },
            markArea: {label:{show: false}},
            nameProperty: 'name',
            data: this.get_county_data()
        }],
      };
      county_map_chart.setOption(option);

      county_map_chart.on('click', (item) => { 
        this.county_detail_chart(item.name);
      });

    },

    county_detail_chart (name) {
      this.hide_taiwan_map = true;
      this.hide_county_map = false;

      const current_county_JSON = Citymap_All[name];
      const county_detail_chart = this.$echarts.init(document.getElementById("county_detail_chart"));
      this.$echarts.registerMap("county", current_county_JSON);

      const option = {
        visualMap: {
          type: 'piecewise',
          itemGap: 0,
          itemSymbol: 'rect',
          splitNumber: 18,
          min: 0,
          max: 17,
          text: ["17", "0"],
          realtime: false,
          // calculable: true,
          inRange: {
              color: ['#a9a9a9', '#ffffff', '#ffffff', '#ffffff', '#e0ffff', '#7fffd4', '#ffff00', '#ffa500', '#ff0000', '#ff0000', '#ff00ff', '#ff00ff', '#4b0082', '#4b0082', '#4b0082', '#4b0082', '#4b0082', '#4b0082', '#4b0082']
          },
        },
        series: [{
            type: 'map',
            map: 'county',
            roam: true,
            top: '0%',
            // aspectScale: 1,
            zoom: 1,
            itemStyle:{
                areaColor: 'none',
                borderColor : '#999',
                borderWidth: 1,  
            },
            emphasis: {
                label: {
                    show: true,
                },
            },
            label: {
                show: true,
            },
            data: map_data_town.data[0]
        }],
      };
      county_detail_chart.setOption(option);

      // 如果點擊空白處的話回上一層
      county_detail_chart.getZr().on('click', (item) => {
        if(item.target === undefined) {
          // console.log('回上一層');
          this.hide_taiwan_map = false;
          county_detail_chart.dispose();
          this.hide_county_map = true;
        }
      })
    },

    get_county_data () {
        let result = [];
        for (let key in town_to_county) {
            result.push({
                'name': key,
                'value': Math.max(...map_data_town.data[0].filter(x => x.name.includes(key)).map(x => x.value))
            });
        }
        return result;
    },
  },
};
</script>
<style scoped>
  .hide-map {
    display: none;
  }

  .chart-area {
      width: 1000px;
      height: 500px;
  }
</style>
