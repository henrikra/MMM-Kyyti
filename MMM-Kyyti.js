/* eslint-disable */
const httpRequest = ({method = 'GET', url, data}) => {
  return new Promise((resolve, reject) => {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onload = () => resolve(JSON.parse(httpRequest.responseText));
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
  start: () => {
    httpRequest({url: env.loginURL, data: credentials, method: 'POST'}).then(res => {
      httpRequest({url: env.myOrdersURL}).then(mitas => {
        console.log('orderdiiiiit', mitas)
      })
    });
  },
  getDom: () => {
    return document.createTextNode("Hello World");
  }
})