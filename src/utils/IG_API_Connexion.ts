/* eslint-disable */

import axios from 'axios';
import { Subscription, LightstreamerClient } from 'lightstreamer-client-web';
import { ACCOUNT_IG, PromiseReject, PromiseResolve } from './IG_connexion_enum';

export class IG_API_Connexion {
  constructor() {}
    private observers: any[] = [];

    init_connexion_IG_API = (api_url: string, api_key: string, identifier: string, password: string): Promise<any> => new Promise((resolve: (PromiseResolve<any>), reject: PromiseReject): void => {
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
      console.log('Trying to connect to LightStreamer...');

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
          console.log(lsClient);
          // lsSubscribe(lsClient, ["L1:IX.D.DAX.IFMM.IP"], ["BID"]);
          resolve(lsClient);
        },
        onStatusChange: (status) => {
          console.log(`Lightstreamer connection status:${status}`);
        },
      });

      // Connect to Lightstreamer
      lsClient.connect();
    });

    subsribeLightStreamer(lsClient: any, itemList: string[], fieldList: string[]): any {
      console.log('lsclient:', lsClient);
      // include the Lightstreamer Subscription module using require.js

      const subscription = new Subscription(
        'MERGE',
        itemList, // e.g. {"MARKET:IX.D.FTSE.DAILY.IP","MARKET:MT.D.GC.MONTH1.IP"}
        fieldList, // e.g. {"BID", "OFFER"}
      );

      // Set up Lightstreamer event listener
      subscription.addListener({
        onSubscription: () => {
          console.log('subscribed');
        },
        onUnsubscription: () => {
          console.log('unsubscribed');
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
          // console.log(result);
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
      for(let o of this.observers) {
        o.updateMarket(result);
      }
    }
}
