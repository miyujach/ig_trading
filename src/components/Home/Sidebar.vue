<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="uk-navbar-item">
        <form action="javascript:void(0)">
          <input
            class="uk-input uk-form-width-small"
            type="text"
            v-model="marketName"
            placeholder="CAC"
          />
          <button
            v-on:click="retreiveMarkets()"
            class="uk-button uk-button-default"
          >
            Search
          </button>
        </form>
      </div>
    </div>

    <div class="sidebar-content">
      <div v-if="items.length" id="sidebar-ig" class="uk-navbar-container">
        <div class="content-sidebar-ig">
          <table
            class="
              uk-table uk-table-striped uk-table-small
              ig-table-instrument-name
            "
            summary="exemple de structure d'un tableau de données 2 lignes, 2 colonnes"
          >
            <tr>
              <th>Name</th>
              <th>Statut</th>
            </tr>
            <tr v-for="row in items" :key="row" @click="viewChart(row)">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Action } from "vuex-class";

@Options({
  components: {},
})
export default class Sidebar extends Vue {
  @Action("requestRetreiveMarkets") requestRetreiveMarkets: any;

  marketName = "DAX";
  items = [];
  headers: string[] = [];

  mounted(): void {
    this.retreiveMarkets();
  }

  viewChart(row: any): void {
    console.log(row);
    this.$emit("viewChartEvent", row);
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

<style scoped lang="less">
.sidebar {
  position: relative;
  display: flex;
  width: 400px;
  height: 100%;
  font-size: 12px;
  border-right: 1px solid rgb(192, 192, 192);

  .sidebar-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .sidebar-content {
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    height: calc(100% - 80px);
    overflow: auto;
  }
}
</style>
