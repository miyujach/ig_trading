<template>
  <div class="layout">
    <Header class="header" />
    <div class="page-content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "@/views/Header.vue";

@Options({
	components: {
		Header
	}
})
export default class Layout extends Vue {}
</script>

<style lang="less">
.layout {
  position: relative;
  height: 100%;
  width: 100%;
  .header {
    height: 80px;
  }
  .page-content {
    height: calc(100% - 80px);
  }
}
</style>
