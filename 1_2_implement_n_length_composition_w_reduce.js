const { expect } = require('chai');
const R = require('ramda');
const { prop } = R;
const { log } = console;

/************************************************************************************/
// generic compose utility for n functions using reduce

// own try
function compose() {
  const funcs = Array.from(arguments).reverse();
  return (val) => {
    return funcs.reduce((acc, func) => func(acc), val);
  };
}

const test = compose(
  (x) => x + 100,
  (x) => x * x,
  (x) => x + 1
);
log(test(1)); //YAY I get it

const test2 = (x) => x + 1000;
log(compose(test2, test)(1));

const n = 99.9999;
const fixedTwo = compose((n) => n / 100, parseInt, R.multiply(100));
log(fixedTwo(n));

// course solution 1
function composeN(...fns) {
  return (x) => {
    return R.reduce(
      (output, fn) => {
        return fn(output);
      },
      x,
      R.reverse(fns)
    );
  };
}

const fixedTwo2 = composeN((n) => n / 100, parseInt, R.multiply(100));
log(fixedTwo2(n));

// course solution 2
function composeR(...fns) {
  return (x) => {
    return R.reduceRight(
      (fn, output) => {
        // why is accumulator and value switched in reduceRight?
        return fn(output);
      },
      x,
      fns
    );
  };
}

const fixedTwo3 = composeR((n) => n / 100, parseInt, R.multiply(100));
log(fixedTwo3(n));
