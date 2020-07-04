export const isObject = (obj) => typeof obj === 'object' && obj !== null;

export const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);

export const hasChanged = (newValue, oldValue) => newValue !== oldValue;

export const isFunction = (val) => typeof val === 'function';
