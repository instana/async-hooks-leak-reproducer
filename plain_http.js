'use strict';

const fs = require('fs');
const http = require('http');
const util = require('util');
const createHook = require('./hooks');

const leakyMap = new Map();

const stats = {
  requests: 0,
  success: 0,
  non2xxStatus: 0,
  errors: 0,
};

createHook(leakyMap);

// print some statistics every two seconds
setInterval(() => {
  debug(JSON.stringify(stats, null, 2));
  debug('entries in leakyMap: ', leakyMap.size);
  debug('uptime:', ((Date.now() - started) / 1000).toFixed(), 'seconds');
  debug(process.memoryUsage());
}, 2000);

// Using an agent with keepAlive=true is necessary to reproduce the issue.
const keepAliveAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 5000,
});

function triggerRequest() {
  stats.requests++;
  const clientRequest = http.request({
    protocol: 'http:',
    host: '127.0.0.1',
    port: 3333,
    agent: keepAliveAgent
  }, function(res) {
    if (res.statusCode !== 200) {
      stats.non2xxStatus++;
    } else {
      stats.success++;
    }
  });

  clientRequest.on('error', e => {
    debug(e);
    stats.error++;
  });

  clientRequest.end();
}

for (var i = 0; i < 5000; i++) {
  setImmediate(triggerRequest);
}

function debug(...args) {
  fs.writeSync(1, `${util.format(...args)}\n`);
}

const started = Date.now();
