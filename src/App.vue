<template>
  <div id="main-app-wrapper">
    <div class="uk-navbar-container tm-navbar-container uk-sticky">
      <nav class="uk-navbar-container uk-margin-left uk-margin-right uk-navbar ig-navbar">
        <div class="uk-navbar-left">
          <a class="uk-navbar-item uk-logo" href="#">Logo</a>
        </div>
        <div class="uk-navbar-right">
          <ul class="uk-navbar-nav">
            <li><router-link to="/">Home</router-link></li>
            <span uk-icon="icon: check; ratio: 2"></span>
          </ul>
          <div class="uk-navbar-item">
            <form action="javascript:void(0)">
              <input class="uk-input uk-form-width-small" type="text" v-model="marketName" placeholder="CAC">
              <button v-on:click="retreiveMarkets()" class="uk-button uk-button-default" >Search</button>
            </form>
          </div>
        </div>
      </nav>
    </div>
    <div id="page-content">
      <div v-if="items.length" id="sidebar-ig" class="uk-navbar-container">
        <div class="content-sidebar-ig">
          <table class="uk-table uk-table-striped uk-table-small ig-table-instrument-name" summary="exemple de structure d'un tableau de données 2 lignes, 2 colonnes">
            <tr>
              <th>
                  Name
              </th>
              <th>
                  Statut
              </th>
            </tr>

            <tr
              v-for="row in items"
              :key="row"
              @click="viewHistory(row)">
              <td>
                {{ row.instrumentName }}
              </td>
              <td>
                {{ row.marketStatus }}
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div id="page-ig">
        <router-view/>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Action } from 'vuex-class';
import { EnumRequestRetreiveMarketHistoryResolution } from '@/store/modules/markets/interfaces';
import { Chart } from '@/components/chart_stock';

export default class HelloWorld extends Vue {
  @Action('requestRetreiveMarkets') requestRetreiveMarkets: any;
  @Action('requestRetreiveMarketHistoryPrices') requestRetreiveMarketHistoryPrices: any;

  marketName = 'DAX';
  items = [];
  headers: string[] = [];
  historicPrices: any;

  retreiveMarkets(): void {
    this.requestRetreiveMarkets(this.marketName).then((response: any) => {
      const results: any = [];

      response.forEach((market: any): void => {
        const fullMarket = { ...market };

        delete market.epic;
        results.push({
          name: fullMarket.epic,
          ...market,
        });
      });
      this.items = results;
      this.headers = Object.keys(results[0]);
      console.log(this.items);
    });
  }

  viewHistory(row: any): void {
    console.log('ok');
    this.requestRetreiveMarketHistoryPrices({
      market: row.name,
      resolution: EnumRequestRetreiveMarketHistoryResolution.MINUTE_15,
      from: '2021-01-4T09:00:00',
      to: '2021-01-5T09:40:00',
      pageSize: 0,
    })
      .then((response: any) => {
        console.log('HISTORY :', response);
        this.historicPrices = response;
        new Chart(document, response);
      });
  }
}
</script>

<style lang="less">
html, body, #app {
  position: relative;
  width: 100%;
  height: 100%;
}
.ig-navbar {
  border-bottom: 1px solid #e5e5e5;
  z-index: 5000;
}
.ig-table-instrument-name {
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}
#main-app-wrapper {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

#page-content {
  position: relative;
  display: flex;
  width: 100%;
  height: calc(100% - 80px);

  #sidebar-ig {
    position: relative;
    display: flex;
    bottom: 0px;
    width: 400px;
    height: 100%;
    overflow-y: auto;

    .content-sidebar-ig {
      position: relative;
      height: 100%;
    }
  }

  #page-ig {
    position: relative;
    display: flex;
    bottom: 0px;
    width: 100%;
    height: 100%;
  }
}
  
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
