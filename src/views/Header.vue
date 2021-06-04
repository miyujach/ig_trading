<template>
  <div class="header">
    <div class="uk-navbar-container tm-navbar-container uk-sticky">
      <nav
        class="
          uk-navbar-container uk-margin-left uk-margin-right uk-navbar
          ig-navbar
        "
      >
        <div class="uk-navbar-left">
          <a class="uk-navbar-item uk-logo" href="#">Logo</a>
        </div>
        <div class="uk-navbar-right">
          <ul class="uk-navbar-nav">
            <li><router-link to="/">Home</router-link></li>
            <span uk-icon="icon: check; ratio: 2"></span>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
	components: {},
})
export default class Layout extends Vue {}
</script>

<style lang="less">
.view-page {
  width: 100%;
}
</style>
