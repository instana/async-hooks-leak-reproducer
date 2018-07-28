'use strict';

const http = require('http');
const port = 3333;
const app = new http.Server();

app.on('request', (req, res) => {
  res.end('Hello World');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
