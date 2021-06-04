<template>
  <div class="view-page view-home-page">
    <MarketView msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import MarketView from '@/components/MarketView.vue'; // @ is an alias to /src

@Options({
  components: {
    MarketView,
  },
})
export default class Home extends Vue {}
</script>

<style lang="less">
.view-page {
  width: 100%;
}
</style>
