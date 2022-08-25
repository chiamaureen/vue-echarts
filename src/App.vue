<template>
  <v-app>
    <v-main class="main-page">
      <div class="d-flex mb-8"> 
        <v-btn 
          class="mr-5"
          @click="line_show = true, map_show= false"
        >
          line chart
        </v-btn>

       
        <v-btn  
          @click="map_show = true, line_show= false"
        >
        map
        </v-btn>
      </div>
      
      <lineChart 
        v-if="line_show"
        chartId="chart" 
        :chartOptions="{}" 
        width="500px" 
        height="500px"
      />
      <!-- <Map /> -->
      <TaiwanMap v-if="map_show"/>
    </v-main>
  </v-app>
</template>

<script>
import lineChart from './components/lineChart';
// import Map from './components/map';
import TaiwanMap from './components/TaiwanMap';

export default {
  name: 'App',

  components: {
    lineChart,
    // Map,
    TaiwanMap
  },

  data() {
      return {
          map_show: false,
          line_show: true
      };
  },
};
</script>
<style scoped>
  .main-page {
    margin: 3rem auto;
    width: 1000px;
  }
</style>