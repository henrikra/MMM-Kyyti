/* eslint-disable */
const httpRequest = (url, data) => {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log(httpRequest.responseText);
      } else {
        console.log('There was a problem with the request.', httpRequest.responseText);
      }
    }
  };
  httpRequest.open('POST', url, true);
  httpRequest.setRequestHeader("Content-Type", "application/json");
  httpRequest.send(JSON.stringify(data));
}

Module.register('MMM-Kyyti', {
  getScripts: function() {
    return [this.file('./credentials.js'), this.file('./env.js')];
  },
  start: () => {
    httpRequest(env.loginURL, credentials);
  },
  getDom: () => {
    return document.createTextNode("Hello World");
  }
})