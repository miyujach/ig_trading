/* eslint-disable */

// Interface
import { IMarketsState } from './interfaces';

const getDefaultState = (): IMarketsState => ({
  markets: [],
  market: {
    details : {},
    history: {}
  }
});

const state = getDefaultState();
export { getDefaultState };

export default state;