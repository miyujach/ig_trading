/* eslint-disable */

import axios from 'axios';
import { Subscription, LightstreamerClient } from 'lightstreamer-client-web';
import { ACCOUNT_IG, PromiseReject, PromiseResolve } from './IG_connexion_enum';
import IgCredentials from '@/utils/IgCredentials';

export class IG_API_Connexion {
  constructor() { }
  private observers: any[] = [];


  init_connexion_IG_API = (): Promise<any> => new Promise((resolve: (PromiseResolve<any>), reject: PromiseReject): void => {
    const { api_url,
      api_key,
      identifier,
      password
    } = IgCredentials;

    axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8';
    axios.defaults.headers.Accept = 'application/json; charset=UTF-8';
    axios.defaults.headers.Version = '2';
    axios.defaults.headers['X-IG-API-KEY'] = api_key;

    axios.post(api_url, {
      identifier,
      password,
    })
      .then((response) => {
        axios.defaults.headers.Version = '1';
        axios.defaults.headers['X-SECURITY-TOKEN'] = response.headers['x-security-token'];
        axios.defaults.headers.CST = response.headers.cst;

        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });

  connectToLightstreamer = (lsEndpoint: string, activeAccountId: string, client_token: string, account_token: string): Promise<any> => new Promise((resolve: (PromiseResolve<any>), reject: PromiseReject): void => {
    // Instantiate Lightstreamer client instance
    const lsClient = new LightstreamerClient(lsEndpoint);

    // Set up login credentials
    lsClient.connectionDetails.setUser(activeAccountId);
    lsClient.connectionDetails.setPassword(`CST-${client_token}|XST-${account_token}`);

    // Add connection event listener callback functions
    // Note: the Lightstreamer library will transparently attempt to reconnect a number of times
    // in the event of communicationss errors
    lsClient.addListener({
      onListenStart: () => {
        console.log('Connected to LightStreamer! Listen start.');
        resolve(lsClient);
      },
      onStatusChange: (status) => {
        console.log(`Lightstreamer connection status:${status}`);
      },
    });

    lsClient.connect();
  });

  subsribeLightStreamer(lsClient: any, itemList: string[], fieldList: string[]): any {
    const subscription = new Subscription(
      'MERGE',
      itemList, // ["MARKET:IX.D.FTSE.DAILY.IP", ...]
      fieldList, // ['BID', 'OFFER', 'HIGH', 'LOW', 'MID_OPEN', 'CHANGE', 'CHANGE_PCT', 'MARKET_DELAY', 'MARKET_STATE', 'UPDATE_TIME']
    );

    // Set up Lightstreamer event listener
    subscription.addListener({
      onSubscription: () => {
        console.log('Subscribed');
      },
      onUnsubscription: () => {
        console.log('Unsubscribed');
      },
      onSubscriptionError: (code, message) => {
        console.log(`subscription failure: ${code} message: ${message}`);
      },
      onItemUpdate: (updateInfo) => {
        // Lightstreamer published some data
        const epic = updateInfo.getItemName().split(':')[1];
        let result: any = {};
        updateInfo.forEachField((fieldName, fieldPos, value) => {
          result = {
            ...result,
          };
          result[fieldName] = value;
        });

        result = {
          itemName: epic,
          ...result,
        };

        this.notifyObserversOnMarketUpdate(result);
      },
    });

    lsClient.subscribe(subscription);
    return subscription;
  }

  unsubsribeLightStreamer(lsClient: any, subscription: any) {
    lsClient.unsubscribe(subscription);
  }

  closeConnexionLightStreamer(lsClient: any) {
    lsClient.closeConnection();
  }

  addObserver(o: any) {
    this.observers.push(o);
  }

  notifyObserversOnMarketUpdate(result: any) {
    for (let o of this.observers) {
      o.updateMarket(result);
    }
  }
}
