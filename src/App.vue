<template>
  <div id="main-app-wrapper">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class HelloWorld extends Vue {}
</script>

<style lang="less">
html,
body,
#app,
#main-app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
