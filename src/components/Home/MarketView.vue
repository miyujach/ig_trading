<template>
  <div class="market-view">
    <Chart ref="chartBuilder" />
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Options, Vue } from "vue-class-component";
import Chart from "@/components/Home/Chart/Chart.vue";

@Options({
  components: {
    Chart,
  },
})
export default class HelloWorld extends Vue {
  market: any = null;

  marketView(market: any): void {
    this.market = market;
    const c: any = this.$refs.chartBuilder;
    c.marketView(market);
  }
}
</script>

<style lang="scss">
.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}
.zoom {
  cursor: move;
  fill: none;
  pointer-events: all;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#page-ig-chart {
  height: 100%;
}
</style>
