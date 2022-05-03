<template>
  <v-app>
    <v-main>
      <!-- <lineChart chartId="chart" :chartOptions="{}" width="500px" height="500px"/> -->
      <Map />
    </v-main>
  </v-app>
</template>

<script>
// import lineChart from './components/lineChart';
import Map from './components/map';

export default {
  name: 'App',

  components: {
    // lineChart,
    Map
  },

  data() {
      return {
          // 
      };
  },
};
</script>
