import { isObject, hasOwn, hasChanged } from '../shared/utils';
import { reactive } from './reactive';
import { track, trigger } from './effect';
import { TrackOpTypes, TriggerOpTypes } from './operation';

const get = createGetter();

const set = createSetter();

function createGetter() {
  return function get(target, key, receiver) {
    const result = Reflect.get(target, key, receiver);

    track(target, TrackOpTypes.GET, key);

    if (isObject(result)) {
      return reactive(result);
    }

    return result;
  };
}

function createSetter() {
  return function set(target, key, value, receiver) {
    // 用于判断是否是新增属性
    const hadKey = hasOwn(target, key);
    // 旧值, 用于判断是否改变了值
    const oldValue = target[key];

    const result = Reflect.set(target, key, value, receiver);

    if (!hadKey) {
      console.log('新增属性操作', target, key);
      trigger(target, TriggerOpTypes.ADD, key, value, oldValue);
    } else if (hasChanged(value, oldValue)) {
      console.log('修改操作', target, key);
      trigger(target, TriggerOpTypes.SET, key, value, oldValue);
    }

    return result;
  };
}

export const mutableHandler = {
  get,
  set,
};
