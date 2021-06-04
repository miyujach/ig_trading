<template>
  <div class="chart-view">
    <svg id="ig-trading-chart" width="100%" height="100%"></svg>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Options, Vue } from "vue-class-component";
import { Action } from "vuex-class";
import { EnumRequestRetreiveMarketHistoryResolution } from "@/store/modules/markets/interfaces";
import { ChartBuilder } from "@/components/Home/Chart/ChartBuilder";

@Options({
  components: {},
  props: {
    market: {
      type: Object as () => any,
    },
  },
})
export default class Chart extends Vue {
  @Action("requestRetreiveMarketHistoryPrices")
  requestRetreiveMarketHistoryPrices: any;
  historicPrices: any;
  bus: any;

  marketView(row: any): void {
    this.requestRetreiveMarketHistoryPrices({
      market: row.name,
      resolution: EnumRequestRetreiveMarketHistoryResolution.MINUTE_15,
      from: "2021-01-4T09:00:00",
      to: "2021-01-5T09:40:00",
      pageSize: 0,
    }).then((response: any) => {
      console.log("HISTORY :", response);
      this.historicPrices = response;
      new ChartBuilder(document, response);
    });
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
.chart-view {
  position: relative;
  width: 100%;
}
</style>
