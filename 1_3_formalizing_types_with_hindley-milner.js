const { expect } = require('chai');
const R = require('ramda');
const { compose, concat } = R;
const { log } = console;

function HayStack(needle) {
  this.needle = R.toUpper(needle);
}

// haystack :: String -> HayStack
// Ramda construct wraps a constructor function inside a curried function that can be called with the same arguments and returns the same type.
// ... so that "new" isn't needed anymore to get a new HayStack object
// ... so it can be used in composition like any other function
const haystackConstructor = R.construct(HayStack);

//getNeedle :: HayStack -> String
const getNeedle = R.prop('needle');

//const whatWeFound = what => `we found a ${what} in a haystack`

// concatTo :: String -> String
// returns a new function where first two arguments are reversed
// In this case, the function concats the second string before the first
const concatTo = R.flip(concat);

// whatWeFound :: String -> String
const whatWeFound = compose(concat('We found a '), concatTo(' in a haystack'));

// needleFromHaystack :: HayStack -> String
const needleFromHaystack = compose(whatWeFound, getNeedle);

// tediousWork :: String -> String
const tediousWork = compose(needleFromHaystack, haystackConstructor);

// map :: (a -> b) -> [a] -> [b]
// map is of type a function that takes as input a function of type (type a to type b)
// that takes as input an array of type a's and returns an array of type b's
const map = R.map;

// intoHayStacks :: [String] -> [HayStack]
// intoHayStacks is a function that takes in array of Strings and outputs an array of HayStacks
// log(map(haystackConstructor)(['a', 'b'])); (same as below)
const intoHayStacks = map(haystackConstructor);

log(intoHayStacks(['a', 'b'])); // [ HayStack { needle: 'A' }, HayStack { needle: 'B' } ]

/************************************************************************************/
// Exercise

// someFunc :: (a->Bool) -> [a] -> [a]
// someFunc is of Type
// a function that takes as
// input : a function that takes as input a value of type a and returns as output a value of type Bool
// output: a function that takes as input an array of a's and returns an array of type a's
const someFuncPKRO = (func) => (a) => a.map(func);

log(someFuncPKRO((x) => !x)([false, true, false, 'x', undefined]));

// course solution

//greaterThan50 :: Number -> Boolean
const greaterThan50 = R.flip(R.lt)(50); // flip flips the lessthan functions arguments
//log(R.lt(20, 50)); // normal -> true
// log(R.flip(R.lt)(20, 50)); // flipped arguments -> false
// log(R.flip(R.lt)(50, 20)); // -> true
const someFunc = (aToBool) => (as) => R.filter(aToBool, as);

const constructedFunc = someFunc(greaterThan50);
log(constructedFunc([40, 60])); // wrong output??? returns [40], not [60]

// filter :: Filterable f => (a -> Boolean) -> f a -> f a
// note fat arrow => f must be filterable (have a filter method)

// R.map revisited
// map :: Functor f => (a->b) -> f a -> f b
// Functor is a datatype that has a map methof, so Array is a functor (but not "functor is an array")
