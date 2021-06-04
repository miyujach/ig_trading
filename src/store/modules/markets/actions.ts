/* eslint-disable */

import axios from 'axios';
import { IRequestRetreiveMarketHistoryPricesParams } from './interfaces';

import {
  RETREIVE_MARKETS,
} from './mutations';

export default {
  requestRetreiveMarkets({ commit }: any, searchMarket: string) {
    axios.defaults.headers.Version = '1';

    return new Promise((result, reject) => {
      axios
        .get(`https://demo-api.ig.com/gateway/deal/markets?searchTerm=${searchMarket}`)
        .then(response => {
          commit(RETREIVE_MARKETS, response.data.markets);
          result(response.data.markets);
        })
        .catch(error => {
          reject(error);
          throw new error(error);
        });
    });
  },
  requestRetreiveMarketHistoryPrices({ commit }: any, {
    market,
    resolution,
    from,
    to,
    pageSize = 0
  }: IRequestRetreiveMarketHistoryPricesParams) {
    axios.defaults.headers.Version = '3';

    return new Promise((result, reject) => {
      axios
        .get(`https://demo-api.ig.com/gateway/deal/prices/${market}?resolution=${resolution}&from=${from}&to=${to}&pageSize=${pageSize}`)
        .then(response => {
          // commit(RETREIVE_HISTORIC_PRICES_MARKETS, response.data.markets);
          result(response.data);
        })
        .catch((error) => {
          reject(error);
          throw new error(error);
        });
    });
  },
};