const { expect } = require('chai');
const R = require('ramda');
const { compose, concat, map, curry, construct, equals } = R;
const { log } = console;

/*************************************************************************/
// Law of equality

// deep comparison of arrays or objects with R.equals
// Dispatches symmetrically to the equals methods of both arguments, if present
log(R.equals([1, 2, [0, 4]], [1, 2, [0, 4]]));
log(R.equals('a', 'a'));
log(R.equals({ x: 'a' }, { x: 'a' }));

// custom datatypes or objects must implement an equals method for it to work
function Num(a) {
  this.value = a;
}

log(R.equals(new Num(10), new Num(10)));

Num.prototype.equals = function (b) {
  return this.value === b.value;
};

const num = construct(Num); // create new objects without "new"
log(num(10).equals(num(10)));

/*************************************************************************/
// Identity law
// identity must hold true no matter if left or right operand

// Identity combinator (also see 2_2 for combinator term)
const identity = (x) => x;

// identity of addition is 0 -> every number +0 === number
// addition :: Number -> Number -> Number
const addition = curry((x, y) => x + y);
addition.identity = 0;
log(addition(10)(addition.identity)); // 10
log(addition(addition.identity)(10)); // 10

// identity of multiplication is 1 -> x * 1 === x
// mult :: Number -> Number -> Number
const mult = curry((x, y) => x * y);
mult.identity = 1;
log(mult(10)(mult.identity)); // 10
log(mult(mult.identity)(10)); // 10

// identity of division is NOT 1 as it works only if on right side of operation
// div :: Number -> Number -> Number
const div = curry((x, y) => x / y);
div.identity = 1;
log(div(10)(div.identity)); // 10
// but NOT:
log(div(div.identity)(10)); // 0.1

/*************************************************************************/
// associative law (law of composition)
// (a * b) * c === a * (b * c)

log(addition(10)(addition(20)(40)) === addition(addition(20)(40))(10));

// composition is associative:
const sums1 = compose(addition(10), addition(20), addition(30));
const sums2 = compose(addition(10), compose(addition(20), addition(30)));
log(sums1(10) === sums2(10));

const data = [1, 4, 6, 12];
const outAssoc = data.map(addition(30)).map(addition(40)).map(addition(10));

const outComposed = compose(
  map(addition(30)),
  map(addition(40)),
  map(addition(10))
);

log(equals(outAssoc, outComposed(data))); // true

// When using compose, we can skip "map" in the composition...
const outComposed2 = compose(addition(30), addition(40), addition(10));
// ...and just map over the generated function
log(map(outComposed2, data));
// ... so that map doesn't produce a new array on every map(...).map(...) but only once

// adding a map method to our Num datatype
Num.prototype.map = function (fn) {
  return new Num(fn(this.value));
};

log(map(outComposed2, num(10))); // ramdas num uses the map method we implemented
log(num(10).map(outComposed2));
