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

  checkForOrders: function() {
    httpRequest({url: env.myOrdersURL}).then(({orders}) => {
      if (orders.length) {
        httpRequest({url: `${env.activeRouteURL}/${orders[0].routeId}`}).then((route) => {
          this.orderTime = route.departureTime.time;
          this.updateDom(1000);
        });
      } else {
        this.orderTime = null;
        this.updateDom(1000);
      }
    });
  },
  
  start: function() {
    httpRequest({url: env.loginURL, data: credentials, method: 'POST'}).then(() => {
      this.checkForOrders();
      setInterval(() => {
        this.checkForOrders();
      }, 30000);
    });
  },

  formatMessage: function() {
    if (moment(this.orderTime).isSame(moment(), 'day')) {
      return 'Your Kyyti arrives at: ' + moment(this.orderTime).format('LT');
    }
    else {
      return 'Upcoming Kyyti: ' + moment(this.orderTime).format('LLL');
    }
  },

  getDom: function() {
    return document.createTextNode(
      this.orderTime ? this.formatMessage() : '\xa0'
    );
  }
})