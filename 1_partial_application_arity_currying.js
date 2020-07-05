const { expect } = require('chai');

function mySum(a, b) {
  // arity of 2 => 2 function arguments
  // stored in functionname.length
  // passed arguments in arguments.length
  // arrow functions don't have an arguments property!
  return a + b;
}

//expect(sum(10)).to.equal(10); // fails => wrong arity
expect(mySum(10)).to.be.a.NaN;
expect(mySum(10, 20)).to.equal(30);
expect(mySum(10, 20, 30)).to.equal(30);

// curried function
function sumCurry(a) {
  return (b) => {
    return a + b;
  };
}

expect(sumCurry(10)).to.be.a('function'); // partial application
//expect(sumCurry(10, 20)).to.equal(30); // fails, returns function!
expect(sumCurry(10, 20)).to.be.a('function'); // the same
expect(sumCurry(10)(20)).to.equal(30);

function sumCurryOrNot(a, b) {
  if (arguments.length === sumCurryOrNot.length) {
    return a + b;
  }

  // otherwise return new function and bind its bind first argument to a (first implicit argument is context ("this"))
  return sumCurryOrNot.bind(null, a);

  //same result:
  // return (b) => {
  //   return a + b;
  // };
}
expect(sumCurryOrNot(5)).to.be.a('function');
expect(sumCurryOrNot(5, 10)).to.equal(15);
expect(sumCurryOrNot(5)(20)).to.equal(25);

/************************************************************************************/
// Writing a utility function to curry functions
/* 
sum as standard arrow function
reminder:
arrow functions
- don't get hoisted
- keep the "this" from where they are defined, NOT from where they are called
- don't have an arguments object
 */
const normalLambdaCurrySum = (a) => (b) => a + b;
expect(normalLambdaCurrySum(3)(5)).to.equal(8);

function curry(func) {
  // return a function...
  return (...args) => {
    // if all parameters required (or more) by func are present, just call the function with the parameteres
    if (args.length >= func.length) {
      return func.apply(null, args); // apply passes array values as individual parameters (_A_pply passes _A_rray)
      // return func.call(null, ...args); // alternative using call
    }
    // less parameters than needed for func? Return a function with the given parameters already applied
    // this new function will expect the number of parameters of the original function MINUS the already applied ones
    // if the function has more than 2 parameters, this needs to be called recursively!
    return curry(func.bind(null, ...args));
  };
}

const stdSum = (a, b, c) => a + b + c;

const curriedSum = curry(stdSum);

expect(curriedSum(5, 10, 20)).to.equal(35);
expect(curriedSum(5, 10)(20)).to.equal(35);
expect(curriedSum(5)(10)(20)).to.equal(35);
expect(curriedSum(5)).to.be.a('function');
expect(curriedSum(5)(10)).to.be.a('function');

/************************************************************************************/
// Actually using currying for something useful

// Data
const prices = {
  game: 59.95,
  nintendo: 399.99,
  controller: 49.99,
  xbox: 29.99,
  ps1: 349.99,
};

const basket = [
  {
    name: 'nintendo',
    qty: 1,
  },
  {
    name: 'controller',
    qty: 3,
  },
  {
    name: 'game',
    qty: 4,
  },
];

const taxrate = 0.075;

// App
const sum = (a, b) => a + b;
const mult = (a, b) => a * b;

//standard solution
/* const total = basket
  .map((item) => mult(item.qty, prices[item.name]))
  .reduce(sum); */

// debugging function
const tap = curry((label, val) => {
  console.log(`${label}: ${val}`);
  return val;
});
// helper
const isObj = (obj) => !!obj && typeof obj === 'object';

// accessors (?)
const get = curry((obj, name) => (isObj(obj) ? obj[name] : null));
// reverse of the above
const prop = curry((name, obj) => get(obj, name));

// like in python, except array instead of tuples
// zip([1,2,3], ['a','b','c']) -> [[1,'a'], [2,'b'], [3,'c']]
const zip = (...arrays) =>
  Array(arrays[0].length)
    .fill([])
    .map((_, index) => arrays.map((item) => item[index]));

//console.log(zip([1, 2, 3], ['a', 'b', 'c']));

const items = basket.map(prop('name'));
const qtys = basket.map(prop('qty'));
const itemPrices = items.map(get(prices));
const priceQtys = zip(itemPrices, qtys);
const subtotals = priceQtys.map((item) => mult(...item));
const total = subtotals.reduce(sum);
const totalWithTaxes = total + total * taxrate;
tap('subtotals', subtotals);
tap('totalWithTaxes', totalWithTaxes);
