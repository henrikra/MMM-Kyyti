/* eslint-disable */
const tryParseJSON = data => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}

const toRad = (value) => value * Math.PI / 180;
function calcCrow(locationA, locationB) {
  const R = 6371;
  const dLat = toRad(locationB.lat - locationA.lat);
  const dLon = toRad(locationB.lon - locationA.lon);
  var lat1 = toRad(locationA.lat);
  var lat2 = toRad(locationB.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d.toFixed(2);
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
          this.setState({
            orderTime: route.departureTime.time,
            pickupLocation: route.legs[0].places[0].location,
          }, 1000);
        });
        httpRequest({url: `${env.baseURL}orders/v1/orders/${orders[0].id}/details/realtime`})
          .then(({products}) => {
            this.setState({carLocation: products[0].location});
          })
      } else {
        this.setState({orderTime: null, pickupLocation: null, carLocation: null}, 1000);
      }
    });
  },
  
  start: function() {
    this.state = {};

    httpRequest({url: env.loginURL, data: credentials, method: 'POST'}).then(() => {
      this.checkForOrders();
      setInterval(() => {
        this.checkForOrders();
      }, 30000);
    });
  },

  setState: function(newData, animationSpeed) {
    this.state = Object.assign({}, this.state, newData);
    this.updateDom(animationSpeed);
  },

  formatMessage: function() {
    if (moment(this.state.orderTime).isSame(moment(), 'day')) {
      return 'Your Kyyti arrives at: ' + moment(this.state.orderTime).format('LT');
    }
    else {
      return 'Upcoming Kyyti: ' + moment(this.state.orderTime).format('LLL');
    }
  },

  formatCarDistance: function() {
    const { pickupLocation, carLocation } = this.state;
    return `${calcCrow(pickupLocation, carLocation)} km away from pickup location`
  },

  getDom: function() {
    const { orderTime, pickupLocation, carLocation } = this.state;

    const wrapper = document.createElement('div');
    const dateText = document.createTextNode(orderTime ? this.formatMessage() : '\xa0');
    const distanceText = document.createElement('div');
    distanceText.innerHTML = carLocation && pickupLocation ? this.formatCarDistance() : '\xa0';
    wrapper.appendChild(dateText);
    wrapper.appendChild(distanceText);
    return wrapper;
  }
})