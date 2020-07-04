// import { reactive, effect, computed, ref  } from "@vue/reactivity";
import { reactive, effect, computed, ref } from './reactivity';

const state = reactive({
  name: 'zdb',
  age: 11,
  arr: [1, 2, 3],
});

const myAge = computed(() => {
  return state.age * 2;
});



effect(() => {
  console.log(myAge.value)
})

myAge.value
myAge.value
myAge.value

state.age = 200;


// effect(() => {
//   console.log(state.name);
//   console.log(JSON.stringify(state.arr));
// });

// state.name = 'wlh';
// state.arr[1] = '1';

// state.arr.push(4);
