/* eslint-disable */
const httpRequest = (url, data) => {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      console.log('tuli done request')
      if (httpRequest.status === 200) {
        console.log(httpRequest.responseText);
      } else {
        console.log('There was a problem with the request.', httpRequest.responseText);
      }
    }
  };
  httpRequest.open('POST', url, true);
  httpRequest.setRequestHeader("Content-Type", "application/json");
  console.log('responset tulille', data)
  httpRequest.send(data);
}

Module.register('MMM-Kyyti', {
  getScripts: function() {
    return [this.file('./credentials.js'), this.file('./env.js')];
  },
  start: () => {
    console.log('STARTING', credentials)
    httpRequest(env.loginURL, {credentials});
  },
  getDom: () => {
    return document.createTextNode("Hello World");
  }
})