import { TriggerOpTypes } from './operation';

export function effect(fn, options = {}) {
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect();
  }
  return effect;
}

let uid = 0;
let activeEffect;
const effectStack = [];

function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect);
        activeEffect = effect;
        return fn();
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };

  effect.options = options;

  effect.uid = uid++;

  effect.deps = [];

  return effect;
}

const targetMap = new WeakMap(); // 和map用法一直, 但是是弱引用, 不会导致内存泄漏

export function track(target, type, key) {
  if (!activeEffect) {
    return;
  }
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);

  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}

export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }

  // const run = (effects) => effects && effects.forEach((effect) => effect());

  // 计算属性优先级高于effect执行
  const effects = new Set();
  const computedRunners = new Set();

  const add = (effectToAdd) => {
    effectToAdd &&
      effectToAdd.forEach((effect) => {
        if (effect.options.computed) {
          computedRunners.add(effect);
        } else {
          effects.add(effect);
        }
      });
  };

  if (key !== null) {
    add(depsMap.get(key));
  }

  if (type === TriggerOpTypes.ADD) {
    // 新增数组, 需要对length属性进行依赖
    add(depsMap.get(Array.isArray(target) ? 'length' : ''));
  }
  const run = (effect) => {
    if (effect.options.schedular) {
      effect.options.schedular();
    } else {
      effect();
    }
  };

  computedRunners.forEach(run);
  effects.forEach(run);
}
