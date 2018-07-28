'use strict';

const async_hooks = require('async_hooks');
const captureStackTrace = require('./stacktrace_util');

module.exports = function createHook(leakyMap) {
  const hook = async_hooks.createHook({
    init(asyncId, type, triggerAsyncId, resource) {
      const stack = captureStackTrace(100).split('at ');
      leakyMap.set(asyncId, {
        asyncId,
        type,
        triggerAsyncId,
        resource,
        stack: stack
      });
    },
    before(asyncId) {
    },
    after(asyncId) {
    },
    destroy(asyncId) {
      leakyMap.delete(asyncId);
    },
    promiseResolve(asyncId) {
    },
  });
  hook.enable();
};
