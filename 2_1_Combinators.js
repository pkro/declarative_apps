const { expect } = require('chai');
const R = require('ramda');
const { compose, concat, map, curry, construct, equals } = R;
const { log } = console;

/***************************************************************************************/
// Combinator functions (pure functions no free variables in function except parameters)

// NOT a combinator
function freeVars(a) {
  const b = 'Vars is innocent!'; // Free variable
  return `${a}, ${b}`;
}

// Combinator examples (all parameters come in as arguments)
function add1(x) {
  return x + 1;
}

const compose2 = (f, g) => (x) => f(g(x));

/***************************************************************************************/
// Is map a combinator?
// imperative version - NOT a combinator as it uses a loop variable
const mapImperative = (func, arr) => {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    out.push(func(arr[i]));
  }
  return out;
};
log(mapImperative((x) => x + 1, [1, 2, 3]));

// Recursive version - IS a combinator / pure function
const mapRecursive = (func, arr) => {
  if (arr.length === 0) {
    return [];
  }
  return [func(arr[0]), ...mapRecursive(func, arr.slice(1))];
};

log(mapRecursive((x) => x + 1, [1, 2, 3]));

// when using functions outside the function definition, it is technically not a combinator anymore
// as it relies on head/tail functions outside of function scope
// which doesn't matter really as combinators are a means to an end and not a merit in itself
// Don't use if it makes code more complex or more difficult to read
const head = ([x, ...rest]) => x; // same as arr[0]; also available as Ramda.head
const tail = ([x, ...rest]) => rest; // same as arr.slice(1); also available as Ramda.tail
const mapRecursiveNotComb = (func, arr) =>
  arr.length ? [func(head(arr)), ...mapRecursive(func, tail(arr))] : [];

log(mapRecursiveNotComb((x) => x + 1, [1, 2, 3]));

// -> map CAN be a combinator depending of implementation
