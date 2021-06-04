/* eslint-disable */

import { getDefaultState } from '@/store/modules/markets/state';
import { IMarketsState, IMarket} from './interfaces';

export const RETREIVE_MARKETS = 'RETREIVE_MARKETS';
export const RERETREIVE_MARKETS = 'RERETREIVE_MARKETS';


// Mutations
export default {
  [RETREIVE_MARKETS](state: IMarketsState, markets_list: IMarket[]) {
    state.markets = markets_list;
    return null;
  },
  [RERETREIVE_MARKETS](state: IMarketsState) {
    Object.assign(state, getDefaultState());
    return null;
  },
}