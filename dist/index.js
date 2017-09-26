'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const def = exports.def = function def(name, expr) {
  return ['def', name, expr];
};

const begin = exports.begin = function begin(exprs) {
  return ['begin'].concat(exprs);
};

const ref = exports.ref = function ref(name) {
  return { '@': name };
};

const get = exports.get = function get(path, obj) {
  return ['get', path, obj];
};

///

const assert = exports.assert = function assert(condition, message) {
  if (!condition) {
    throw message || "Assertion failed";
  }
};

const colorless = exports.colorless = function colorless(version) {
  return function (send) {
    return function (o) {
      const onSuccess = o.onSuccess || false;
      const onFailure = o.onFailure || false;

      const message = {
        version: {
          major: version.major,
          minor: version.minor
        },
        colorless: {
          major: 0,
          minor: 0
        },
        meta: o.meta,
        calls: o.calls || []
      };

      function* handle(response) {
        if (response.tag === 'Success') {
          if (onSuccess) {
            return yield* onSuccess(response.success);
          }
        }
        if (response.tag === 'Error') {
          if (onFailure) {
            return yield* onFailure(response.error);
          }
        }
      }

      return new Promise(function (resolve, reject) {
        return send(message, handle, resolve, reject);
      });
    };
  };
};