/* eslint-disable */
import axios from 'axios';
import store from '@/store/index';


/**
 * Add Authorization token to each request http
 */

axios.interceptors.request.use(
  config => {
    // clone config object 
    return config;
  },
  err => Promise.reject(err),
);


axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // if (error.response.status === 401 && error.response.data == 'session_expired') {
    //   store.dispatch("logoutUser");
    // }
    return Promise.reject(error);
  },
);

export default () => { };