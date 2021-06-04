<template>
  <div class="market-view">
    <svg id="ig-trading-chart" width="100%" height="100%"></svg>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Options, Vue } from "vue-class-component";

@Options({
  components: {},
})
export default class HelloWorld extends Vue {}
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
