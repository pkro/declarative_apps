const R = require('ramda');

function curry(func) {
  return (...args) => {
    if (args.length >= func.length) {
      return func.apply(null, args); // apply passes array values as individual parameters (_A_pply passes _A_rray)
    }
    return curry(func.bind(null, ...args));
  };
}

function compose() {
  const funcs = Array.from(arguments).reverse();
  return (val) => {
    return funcs.reduce((acc, func) => func(acc), val);
  };
}

// tap :: Function -> a -> a
const tap = (f) => (x) => {
  f(x);
  return x;
};

const labelLog = (label) => console.log.bind(console, label);

const trace = compose(tap, labelLog);

compose.log = compose(
  R.apply(compose), // compose resulting list
  R.prepend(trace), // prepend resulting list with the trace function so we have the end result
  R.reduce((acc, fn) => [...acc, fn, trace], []), // put trace between each step
  Array // make an array from the arguments
);

module.exports = { curry, compose };
