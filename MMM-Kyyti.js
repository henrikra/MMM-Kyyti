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
    return [this.file('./credentials.js'), this.file('./env.js'), 'moment.js'];
  },
  start: function() {
    httpRequest({url: env.loginURL, data: credentials, method: 'POST'}).then(() => {
      setInterval(() => {
        httpRequest({url: env.myOrdersURL}).then(({orders}) => {
          httpRequest({url: `${env.activeRouteURL}/${orders[0].routeId}`}).then((route) => {
            console.log('route tuli', route)
            this.orderTime = route.departureTime.time;
            this.updateDom(1000);
          });
        });
      }, 5000);
    });
  },
  getDom: function() {
    return document.createTextNode(
      this.orderTime ? 'Your Kyyti arrives at: ' + moment(this.orderTime).format('LT') : '\xa0'
    );
  }
})