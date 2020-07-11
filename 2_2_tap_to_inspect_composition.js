const { expect } = require('chai');
const R = require('ramda');
const { compose, curry, equals, apply, prepend } = R;
const { log } = console;

/***************************************************************************************/
// Tap to ease debugging of point free code (own first impure implementation, course stuff see below)
// can be implemented without curry or prefix of course
const impureTap = curry((prefix, val) => {
  console.log(`${prefix}: ${val}`);
  return val;
});

const add1 = (x) => x + 1;
const mult2 = (x) => x * 3; // oh no bug
const mult100 = (x) => x * 100;

const doMathStuff = compose(add1, mult2, mult100);
const calculateMe = [1, 2, 3];
const wrongResult = calculateMe.map(doMathStuff);
log(wrongResult);
log(equals(wrongResult, [201, 401, 601])); // oh no bug

const log1 = impureTap('afterMult100');
const log2 = impureTap('afterMultBy2');
const doMathStuffWithLogging = compose(add1, log2, mult2, log1, mult100);

const wrongResult2 = calculateMe.map(doMathStuffWithLogging);
// afterAdding100: 100
// afterMultBy2: 300 -> AHAAAA BUG
// afterAdding100: 200
// afterMultBy2: 600
// afterAdding100: 300
// afterMultBy2: 900

/***************************************************************************************/
// Longer explanation

//Identity combinator - can be put wherever in a composition chain as it just returns itself (law of identity)
// I :: a -> a
const I = (x) => x;

// impure trace function
// trace :: a -> a
const impureTrace = (a) => {
  console.log(x);
  return x;
};

// pure tap - no side efects like console.log
// tap :: Function -> a -> a
const tap = (f) => (x) => {
  f(x);
  return x;
};

const simpleTrace = tap(console.log); // just logs without comment
// labelLog :: Str -> Function
const labelLog = (label) => console.log.bind(console, label);

labelLog('what is')('up');

const trace = compose(tap, labelLog);

const doMathStuffWithTrace = compose(
  trace('Result'),
  add1,
  trace('after mult 2'),
  mult2,
  trace('after mult100'),
  mult100,
  trace('Initial value')
);

doMathStuffWithTrace(1);

// compose with included logging
// logCompose :: ((a -> b), ... (y- > z)) -> (z -> a)
function logPose(...fns) {
  const funcs = fns.reduce((acc, fn) => [...acc, fn, simpleTrace], []);
  return compose(simpleTrace, ...funcs);
}

const doMathStuffWithLogPose = logPose(add1, mult2, mult100);
doMathStuffWithLogPose(1);

//point free and as method of compose
compose.clog = compose(
  R.apply(compose), // compose resulting list
  R.prepend(trace), // prepend resulting list with the trace function so we have the end result
  R.reduce((acc, fn) => [...acc, fn, trace], []), // put trace between each step
  Array // make an array from the arguments
);
