<template>
  <v-app>
    <v-main>
      <!-- <lineChart chartId="chart" :chartOptions="{}" width="500px" height="500px"/> -->
      <!-- <Map /> -->
      <TaiwanMap />
    </v-main>
  </v-app>
</template>

<script>
// import lineChart from './components/lineChart';
// import Map from './components/map';
import TaiwanMap from './components/TaiwanMap';

export default {
  name: 'App',

  components: {
    // lineChart,
    // Map,
    TaiwanMap
  },

  data() {
      return {
          // 
      };
  },
};
</script>
