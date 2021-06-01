<template>
  <div class="page">
    <div class="input-group-market">
        <input v-model="market_name" placeholder="CAC">
        <button v-on:click="retreiveMarkets()">Search Market "{{ market_name }}"</button>
    </div>

    <div class="search-result">
      <table class="results_markets" summary="exemple de structure d'un tableau de données 2 lignes, 2 colonnes">
        <tr>
          <th
            v-for="column_name in headers"
            :key="column_name">
              {{column_name}}
          </th>
        </tr>

        <tr
          v-for="row in items"
          :key="row"
          @click="viewHistory(row)">
          <td
            v-for="item in row"
            :key="item">
            {{item}}
          </td>
        </tr>
      </table>
    </div>

    <svg id="ig-trading-chart" width="960" height="500"></svg>

    <div class="history-prices">
      {{historic_prices}}
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Options, Vue } from 'vue-class-component';
import { IG_API_Connexion } from '../utils/IG_API_Connexion';
import { ACCOUNT_IG } from '../utils/IG_connexion_enum';
import Component from 'vue-class-component';
import { Action, Getter } from 'vuex-class';
import { EnumRequestRetreiveMarketHistoryResolution } from '@/store/modules/markets/interfaces';

import { Chart } from '@/components/chart_stock';

export default class HelloWorld extends Vue {
  @Action('requestRetreiveMarkets') requestRetreiveMarkets: any;
  @Action('requestRetreiveMarketHistoryPrices') requestRetreiveMarketHistoryPrices: any;
  @Getter('getMarkets') getMarkets: any;
  market_name = "DAX";
  items = [];
  headers: string[] = [];
  historic_prices: any;

  mounted() {
    
    const rest_url = 'https://demo-api.ig.com/gateway/deal/session';
    const rest_api_key = 'f85ff82185443f83fe39d522c7fe6432f315dbf5';
    const rest_identifier = 'michaeljachtls_demo';
    const rest_password = 'Escapethefate46300!';
    
    const IG_API = new IG_API_Connexion();
    IG_API.addObserver(this);

    
    IG_API.init_connexion_IG_API(rest_url, rest_api_key, rest_identifier, rest_password).then((response) => {
      console.log('Connected :', response.data.lightstreamerEndpoint);
      const account = response.data.accounts.filter((account: any) => account.accountName === ACCOUNT_IG.CFD);
      const { accountId } = account;

      const lsClient = IG_API.connectToLightstreamer(response.data.lightstreamerEndpoint, accountId, response.headers.cst, response.headers['x-security-token'])
        .then((lsClient) => {
          // Retreive live stream off stock
          IG_API.subsribeLightStreamer(lsClient, ['L1:IX.D.DAX.IFMM.IP', 'L1:IX.D.DAX.IDF.IP'], ['BID', 'OFFER', 'HIGH', 'LOW', 'MID_OPEN', 'CHANGE', 'CHANGE_PCT', 'MARKET_DELAY', 'MARKET_STATE', 'UPDATE_TIME']);
        });
    });
    
    new Chart(this);
  }

  retreiveMarkets() {
    this.requestRetreiveMarkets(this.market_name).then((response: any) => {
      let results: any = [];

      response.forEach((market: any) => {
        const full_market = {...market};

        delete market.epic;
        results.push({
          name: full_market.epic,
          ...market
        });
      });


      console.log("RES", results)
      this.items = results;
      this.headers = Object.keys(results[0]);
    });
    
  }

  viewHistory(row: any) {
    console.log('Name ', row.name)
    this.requestRetreiveMarketHistoryPrices({
      market: row.name, 
      resolution: EnumRequestRetreiveMarketHistoryResolution.MINUTE_15,
      from: "2021-01-4T00:00:00",
      to: "2021-01-4T06:59:59",
      pageSize: 0})
    .then((response: any) => {
      console.log('HISTORY :', response)
      this.historic_prices = response;
    })
  }

  updateMarket(resultItemUpdate: any) {
    // console.log('MODEL :', resultItemUpdate)
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
.page {
  position: relative;
  display: block;
  width: 100%;

  .input-group-market {
    display: flex;
    flex-direction: row;

    input, button {
      display: flex;
    }
  }
  .results_markets {
      position: relative;
      text-align: left;
      font-family: Arial, Helvetica, sans-serif;
      border-collapse: collapse;
      width: 100%;
      font-size: 12px;

      td, th {
        border: 1px solid #ddd;
        padding: 4px;
      }

      tr:nth-child(even){background-color: #f2f2f2;}

      tr:hover {background-color: #ddd;}

      th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: center;
        background-color: #04AA6D;
        color: white;
      }
    }
}

</style>
