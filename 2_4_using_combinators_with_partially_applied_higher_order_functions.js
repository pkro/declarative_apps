const R = require('ramda');
const { compose } = require('./functional_utilities');
const { S, B, T, I, K, C } = require('./combinators');
const { log } = console;

const slides = [
  {
    id: 1,
    title: 'Learn You Well',
    content: 'A slideshow in functional programming',
  },
  {
    id: 2,
    title: 'Combinators',
    content: `
      Pure functions with no free variables`,
  },
  {
    id: 3,
    title: 'Combinators',
    content: `
      Pure functions with no free variables;
      All variables are passed in by parameters`,
  },
];

// imperative or version:
// function safeVal(val) {
//   const primaryVal = primary(val);
//   if(primaryVal) {
//     return primaryVal
//   }
//   return secondary(val)
// }

// or combinator
// or :: (a -> b) -> (a -> c) -> a -> b|c
// function or(primary, secondary) {
//   return (val) => primary(val) || secondary(val);
// }
// or :: (a -> b,  a -> c) -> a -> b|c
const or = (f, g) => (x) => f(x) || g(x); // R.either

// curried or would be
// or :: (a -> b) => (a -> c) -> a -> b|c
const or_curried = (f) => (g) => (x) => f(x) || g(x);

// getSlide :: Int -> Slide
// C = R.flip
const getSlide = C(R.nth())(slides);

// trace :: x -> x (with side effect)
const trace = S(K)(console.log);

// displayTitle :: Slide -> String
//const displayTitle = compose(trace, R.prop('title'));
const displayTitle = B(trace)(R.prop('title'));

// emptySlide :: * -> Slide
const emptySlide = K({
  id: 0,
  title: 'empty',
  content: '',
});

// ifElse :: (a -> Bool, a -> b, a -> c) -> a -> b|c
const ifElse = (f, g, h) => (x) => (f(x) ? g(x) : h(x)); // Ramda.ifElse

// when :: (a -> Bool, a -> b) -> a -> a|b
const when = (f, g) => ifElse(f, g, I); // Ramda.when
// or complete:
// when = (f, g) => x => f(x) ? g(x) : x

// decorateFirst :: Slide -> Slide
// const decorateFirst = ifElse(
//   R.propEq('id', 1),
//   R.over(R.lensProp('title'), R.concat('*** 1st slide ***\n')),
//   I // just return as is
// );
// ---> refactored using when combinator
const decorateFirst = when(
  R.propEq('id', 1),
  R.over(R.lensProp('title'), R.concat('*** 1st slide ***\n'))
);

// conditions: takes as input an array of arrays (tuples) that each contain
//    a function that takes input (type a) and returns a bool and
//    a function that takes input (type a) and returns any type (*)
// and returns a function that takes as input (type a) and returns any of the wildcard types (*)
// conditions :: [[a -> Bool, a -> *]] -> a -> *

// Procedural implementation (now that was easy)
// const conditions = (pairs) => (x) => {
//   // procedural
//   for (let i = 0; i < pairs.length; i++) {
//     if (pairs[i][0](x)) return pairs[i][1](x);
//   }
//   return pairs[pairs.length - 1][1](x);
// };

// recursive
// const conditions = (pairs) => (x) => {
//   const [[f, g], ...rest] = pairs;
//   return f(x) ? g(x) : conditions(rest)(x);
// };

// using Ramda:
const conditions = R.cond; // R.cond is the same as the function(s) above
// works similar to a switch statement
otherwise = K(true); // sama as () => true, same as Ramda.T (short for K(true))

const nameTheNumber = conditions([
  [(x) => x === 1, (x) => `value ${x} is one`],
  [(x) => x === 2, (x) => `value ${x} is two`],
  [(x) => x === 3, (x) => `value ${x} is three`],
  [otherwise, () => 'it was another number'],
]);

// log(nameTheNumber(2)); // value 2 is two
// log(nameTheNumber(5)); // it was another number'

// showSlide :: Int -> Slide
// const showSlide = compose(displayTitle, getSlide); // produces undefined with wrong index, so we refactor
const showSlide = compose.log(
  nameTheNumber,
  R.prop('id'),
  //displayTitle,
  decorateFirst,
  or(getSlide, emptySlide)
); // produces undefined with wrong index, so we refactor

showSlide(0); // "*** 1st slide ***\n Learn You Well"
showSlide(5); // "Empty"
