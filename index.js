export const def = (name, expr) => ['def', name, expr];

export const begin = (exprs) => ['begin'].concat(exprs);

export const ref = (name) => ({'@': name});

export const get = (path, obj) => ['get', path, obj];

///

export const assert = (condition, message) => {
  if (!condition) {
    throw message || "Assertion failed";
  }
};

export const colorless = version => send => o => {
  const onSuccess = o.onSuccess || false;
  const onFailure = o.onFailure || false;

  const message = {
    version: {
      major: version.major,
      minor: version.minor,
    },
    colorless: {
      major: 0,
      minor: 0,
    },
    meta: o.meta,
    calls: o.calls || [],
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

  return new Promise((resolve, reject) => send(message, handle, resolve, reject));
};
