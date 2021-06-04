/* eslint-disable */ 
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import lang from './i18n';

import interceptor from '@/helpers/httpInterceptor';

import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'
import '@vuikit/theme'


//import UIkit from 'uikit';
//import Icons from 'uikit/dist/js/uikit-icons';
//import "uikit/dist/css/uikit.min.css";
//UIkit.use(Icons);

// Global variable
// Vue.set(Vue.prototype, '$NotifMail', NotifMail);

// use UTC by default;
// timezone.tz.setDefault('UTC');

// Internationalization plugin of Vue.js
// Vue.use(VueI18n);

// Create Internationalization plugin instance
// const i18n = new VueI18n({
//     locale: 'en',
//     fallbackLocale: 'en',
//     messages: lang,
//     silentTranslationWarn: true,
// });

interceptor();
  
// export { i18n as default };

createApp(App)
  .use(store)
  .use(router)
  //.use(UIkit)
  .use(Vuikit)
  .use(VuikitIcons)
  .mount('#app');
