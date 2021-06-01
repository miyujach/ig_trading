/* eslint-disable */

import { IMarketsState } from './interfaces';

const getMarkets = (state: IMarketsState): any => state.markets;

export default {
  getMarkets, // get all the markets informations
}