<template>
  <div id="page-ig-chart" class="page">
    <svg id="ig-trading-chart" width="100%" height="100%"></svg>
    <!--<div class="history-prices">
      {{historic_prices}}
    </div>-->
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Options, Vue } from 'vue-class-component';
import { IG_API_Connexion } from '../utils/IG_API_Connexion';
import { ACCOUNT_IG } from '../utils/IG_connexion_enum';
import { Action, Getter } from 'vuex-class';
import { EnumRequestRetreiveMarketHistoryResolution } from '@/store/modules/markets/interfaces';

import { Chart } from '@/components/chart_stock';
// import { IconCheck, IconClose } from '@vuikit/icons'

@Options({
  components: {
    // VkIconsCheck: IconCheck,
    // VkIconsClose: IconClose
  },
})
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
    const rest_api_key = 'x';
    const rest_identifier = 'x';
    const rest_password = 'x';
    
    const IG_API = new IG_API_Connexion();
    IG_API.addObserver(this);

    
    IG_API.init_connexion_IG_API(rest_url, rest_api_key, rest_identifier, rest_password).then((response) => {
      console.log('Connected :', response.data.lightstreamerEndpoint);
      const account = response.data.accounts.filter((account: any) => account.accountName === ACCOUNT_IG.CFD);
      const { accountId } = account;

      const lsClient = IG_API.connectToLightstreamer(response.data.lightstreamerEndpoint, accountId, response.headers.cst, response.headers['x-security-token'])
        .then((lsClient) => {
          // Retreive live stream off stock
          IG_API.subsribeLightStreamer(lsClient, ['L1:IX.D.DAX.IFMM.IP'], ['BID', 'OFFER', 'HIGH', 'LOW', 'MID_OPEN', 'CHANGE', 'CHANGE_PCT', 'MARKET_DELAY', 'MARKET_STATE', 'UPDATE_TIME']);
        });
    });
    
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
      this.items = results;
      this.headers = Object.keys(results[0]);
    });
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
#page-ig-chart {
  height: 100%;
}
</style>
