/* eslint-disable */
const tryParseJSON = data => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}

const httpRequest = ({method = 'GET', url, data}) => {
  return new Promise((resolve, reject) => {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onload = () => resolve(tryParseJSON(httpRequest.responseText));
    httpRequest.onerror = () => reject(httpRequest.statusText);
    httpRequest.open(method, url, true);
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(JSON.stringify(data));
  }); 
}

Module.register('MMM-Kyyti', {
  getScripts: function() {
    return [this.file('./credentials.js'), this.file('./env.js')];
  },
  start: function() {
    var self = this;
    httpRequest({url: env.loginURL, data: credentials, method: 'POST'}).then(function(res) {
      httpRequest({url: env.myOrdersURL}).then(function(mitas) {
        httpRequest({url: `${env.activeRouteURL}/${mitas.orders[0].routeId}`}).then(function(route) {
          console.log('route tuli', route.departureTime.time)
          self.orderTime = route.departureTime.time;
          self.updateDom(1000);
        })
      })
    });
  },
  getDom: function() {
    return document.createTextNode(this.orderTime ? this.orderTime : "Hello World");
  }
})