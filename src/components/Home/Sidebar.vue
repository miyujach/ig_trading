<template>
  <div class="sidebar">
    <div id="page-content">
			<div class="uk-navbar-item">
			<form action="javascript:void(0)">
					<input class="uk-input uk-form-width-small" type="text" v-model="marketName" placeholder="CAC">
					<button v-on:click="retreiveMarkets()" class="uk-button uk-button-default" >Search</button>
			</form>
    </div>
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
import { Options, Vue } from 'vue-class-component';
import { Action } from 'vuex-class';
import { EnumRequestRetreiveMarketHistoryResolution } from '@/store/modules/markets/interfaces';
import { Chart } from '@/components/chart_stock';

@Options({
	components: {
	},
})
export default class Sidebar extends Vue {
	@Action('requestRetreiveMarkets') requestRetreiveMarkets: any;
	@Action('requestRetreiveMarketHistoryPrices') requestRetreiveMarketHistoryPrices: any;

	marketName = 'DAX';
	items = [];
	headers: string[] = [];

	historicPrices: any;

	viewHistory(row: any): void {
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
}

</script>

<style lang="less">

</style>
