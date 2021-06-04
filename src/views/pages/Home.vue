<template>
  <div class="view-page view-home-page">
    <template v-if="connectedToIG">
      <Sidebar class="sidebar" />
      <MarketView
        class="market-view"
        msg="Welcome to Your Vue.js + TypeScript App"
      />
    </template>
  </div>
</template>

<script lang='ts'>
import { Options, Vue } from "vue-class-component";
import Sidebar from "@/components/Home/Sidebar.vue";
import MarketView from "@/components/Home/MarketView.vue";
import { Action, Getter } from "vuex-class";

import { IgApiConnexion } from "../../utils/IgApiConnexion";
import { ACCOUNT_IG } from "../../utils/IgConnexionEnum";

@Options({
  components: {
    MarketView,
    Sidebar
  }
})
export default class Home extends Vue {
  @Action("requestRetreiveMarkets") requestRetreiveMarkets: any;
  @Action("requestRetreiveMarketHistoryPrices")
  requestRetreiveMarketHistoryPrices: any;
  @Getter("getMarkets") getMarkets: any;
  marketName = "DAX";
  items = [];
  headers: string[] = [];
  historicPrices: any;
  connectedToIG = false;

  mounted(): void {
    const IG_API = new IgApiConnexion();
    IG_API.addObserver(this);
    IG_API.initConnexionIgApi().then((response: any) => {
      this.connectedToIG = true;
      console.log("Connected :", response.data.lightstreamerEndpoint);
      const accountIG = response.data.accounts.filter(
        (account: any) => account.accountName === ACCOUNT_IG.CFD
      );
      const { accountId } = accountIG;

      IG_API.connectToLightstreamer(
        response.data.lightstreamerEndpoint,
        accountId,
        response.headers.cst,
        response.headers["x-security-token"]
      ).then((lsClient: any) => {
        // Retreive live stream off stock
        IG_API.subsribeLightStreamer(
          lsClient,
          ["L1:IX.D.DAX.IFMM.IP"],
          [
            "BID",
            "OFFER",
            "HIGH",
            "LOW",
            "MID_OPEN",
            "CHANGE",
            "CHANGE_PCT",
            "MARKET_DELAY",
            "MARKET_STATE",
            "UPDATE_TIME"
          ]
        );
      });
    });
  }

  // updateMarket(resultItemUpdate: any) {
  //   // console.log('MODEL :', resultItemUpdate)
  // }
}
</script>

<style lang='less'>
.view-page {
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;

  .market-view {
    display: flex;
    width: 100%;
  }
}
</style>
