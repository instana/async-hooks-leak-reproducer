'use strict';

const fs = require('fs');
const http = require('http');
const util = require('util');
const createHook = require('./hooks');

const requestModule = require('request');

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
});

function triggerRequest(iterations) {
  if (iterations <= 0) {
    return;
  }
  stats.requests++;
  requestModule({
    uri: 'http://127.0.0.1:3333',
    agent: keepAliveAgent
  }, (err, res) => {
    if (err) {
      console.log(err);
      stats.errors++;
      return;
    }
    if (res.statusCode !== 200) {
      stats.non2xxStatus++;
    } else {
      stats.success++;
    }
    triggerRequest(--iterations);
  });
}

triggerRequest(5000);

function debug(...args) {
  fs.writeSync(1, `${util.format(...args)}\n`);
}

const started = Date.now();
