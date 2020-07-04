import { isFunction } from '../shared/utils';
import { effect, track, trigger } from './effect';
import { TrackOpTypes, TriggerOpTypes } from './operation';

export function computed(getOrOptions) {
  let getter;

  let setter;
  if (isFunction(getOrOptions)) {
    getter = getOrOptions;
    setter = () => {};
  } else {
    getter = getOrOptions.get;
    setter = getOrOptions.set;
  }

  let dirty = true;

  let computed;

  let runner = effect(getter, {
    lazy: true,
    computed: true,
    schedular: () => {
      if (!dirty) {
        dirty = true;
        trigger(computed, TriggerOpTypes.SET, 'value');
      }
    },
  });

  let value;
  computed = {
    get value() {
      if (dirty) {
        value = runner();
        dirty = false;
        track(computed, TrackOpTypes.GET, 'value');
      }
      return value;
    },
    set value(newValue) {
      setter(newValue);
    },
  };

  return computed;
}
