const R = require('ramda');

function curry(func) {
  return (...args) => {
    if (args.length >= func.length) {
      return func.apply(null, args); // apply passes array values as individual parameters (_A_pply passes _A_rray)
    }
    return curry(func.bind(null, ...args));
  };
}

// something seems to be wrong with the functions below
const compose = R.compose;
// work fine by themselves, but not when used in compose.log (there only R.compose works for some reason)
// function compose() {
//   const funcs = Array.from(arguments).reverse();
//   return (val) => {
//     return funcs.reduce((acc, func) => func(acc), val);
//   };
// }

// function compose(...fns) {
//   return (x) => {
//     return R.reduceRight((fn, output) => fn(output), x, fns);
//   };
// }

// tap :: Function -> a -> a
// variant of identity combinator (?)
const tap = (f) => (x) => {
  f(x);
  return x;
};

const trace = tap(console.log.bind(console));
// or just const trace = tap(console.log); ?

// why doesn't this work with "my" compose?
compose.log = compose(
  R.apply(compose), // compose resulting list
  R.prepend(trace), // prepend resulting list with the trace function so we have the end result
  R.reduce((acc, fn) => [...acc, fn, trace], []), // put trace between each step
  //R.reduce((acc, fn) => acc.concat(fn, trace), []),
  Array // make an array from the arguments
);

module.exports = { curry, compose };
