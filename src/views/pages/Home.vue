<template>
  <div class="view-page view-home-page">
    <Sidebar class="sidebar" />
    <MarketView
      class="market-view"
      msg="Welcome to Your Vue.js + TypeScript App"
    />
  </div>
</template>

<script lang='ts'>
import { Options, Vue } from "vue-class-component";
import Sidebar from "@/components/Home/Sidebar.vue";
import MarketView from "@/components/Home/MarketView.vue";

@Options({
  components: {
    MarketView,
    Sidebar,
  },
})
export default class Home extends Vue {}
</script>

<style lang='less'>
.view-page {
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;

  .sidebar {
    display: flex;
    width: 400px;
  }
  .market-view {
    display: flex;
    width: 100%;
  }
}
</style>
