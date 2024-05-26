import axios from "axios"
import _ from "lodash";

export const http = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT
})

http.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('social-v2.wechat.accessToken');

  config.headers['Authorization'] = `Bearer ${accessToken}`
  config.headers['Content-Type'] = `application/json`
  config.headers['appName'] = process.env.REACT_APP_NAME
  config.headers['appVersion'] = process.env.REACT_APP_VERSION
  config.headers['platform'] = process.env.REACT_APP_PLATFORM
  config.headers['accept'] = `*/*`
  config.headers['X-Requested-With'] = `XMLHttpRequest`
  return config;
}, function (error) {

  console.log(error)
  return Promise.reject(error);
});


http.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  if (_.has(error, 'response.data.error')) {
    console.log(error)
    const responseErr = _.get(error, 'response.data.error')
    console.log("http.interceptors.response", { responseErr })
    return Promise.reject(responseErr)
  }
  return Promise.reject(error);
});



