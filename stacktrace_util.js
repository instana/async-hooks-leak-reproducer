'use strict';

module.exports = function captureStackTrace(length, referenceFunction) {
  referenceFunction = referenceFunction || exports.captureStackTrace;
  var originalLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = length;
  var stackTraceTarget = {};
  Error.captureStackTrace(stackTraceTarget, referenceFunction);
  var stack = stackTraceTarget.stack;
  Error.stackTraceLimit = originalLimit;
  return stack;
};
