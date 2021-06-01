/* eslint-disable */

export interface IMarketsState {
    markets: IMarket[];
    market: {
        details: {},
        history: {}
    }
}


export interface IMarket {
    bid: any;
    delayTime: number;
    epic: string;
    expiry: string;
    high: number;
    instrumentName: string;
    instrumentType: string;
    low: number;
    marketStatus: string;
    netChange: number;
    offer: any;
    percentageChange: number;
    scalingFactor: number;
    streamingPricesAvailable: boolean;
    updateTime: string;
    updateTimeUTC: string;
}


export interface IRequestRetreiveMarketHistoryPricesParams {
    market: string;
    resolution: EnumRequestRetreiveMarketHistoryResolution;
    from: string;
    to: string;
    pageSize: number;
}

export enum EnumRequestRetreiveMarketHistoryResolution {
    SECOND = "SECOND",
    MINUTE =  "MINUTE", 
    MINUTE_2 = "MINUTE_2",
    MINUTE_3 = "MINUTE_3",
    MINUTE_5 = "MINUTE_5",
    MINUTE_10 = "MINUTE_10", 
    MINUTE_15 = "MINUTE_15",
    MINUTE_30 = "MINUTE_30",
    HOUR = "HOUR",
    HOUR_2 = "HOUR_2",
    HOUR_3 = "HOUR_3",
    HOUR_4 = "HOUR_4",
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH"
}