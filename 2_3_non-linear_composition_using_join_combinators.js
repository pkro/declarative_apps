const { expect } = require('chai');
const R = require('ramda');
const { compose } = require('./functional_utilities');
const { log } = console;

// getData is missing in the code files and the repository, this is a replacement:
const makeAge = (upper) => compose(Math.floor, (x) => x * upper, Math.random);
const makeAge100 = makeAge(100);

const makeUser = (() => {
  let runner = 0;
  return function () {
    runner++;
    return {
      id: runner,
      name: {
        first: `firstname ${runner}`,
        last: `lastname ${runner}`,
      },
      isActive: Math.random() < 0.5,
      email: `player${runner}@example.com`,
      age: makeAge100(),
      tags: ['tag1', 'tag2'],
      greeting: `Hello, firstname ${runner}`,
      game: 'poker',
    };
  };
})();

const getData = () =>
  Array(10)
    .fill(0) // without fill map doesn't work as it probably just sets .length to 10
    .map((e) => makeUser());

//log(getData());

/***************************************************************************************/
// K combinator (Konst-combinator)
/* 
const K = (x) => (y) => x;

const two = K(2);
log(two()); // 2
log(two(10)); // 2

const oneTwo = K([1, 2]);
const nums = oneTwo([3, 4]);
log(oneTwo()); // [1,2]

nums.push(10);
log(oneTwo()); // [1,2,10] - why? "strange actor when it comes to composite types" ?
*/
/* 
// I(dentity) combinator (R.identity)
const I = (x) => x;

// K (constant) combinator takes a value and returns a (constant) unary function that always returns that value. (R.always)
// where const creates a variable that always points to the same value, K(onst) creates a function that returns always the same value
const K = (x) => (y) => x;

// C combinator (takes in a function with the first two arguments flipped) (R.flip)
const C = (f) => (a) => (b) => f(b)(a);

// B combinator (compose combinator for 2 functions)
const B = (f) => (g) => (x) => f(g(x));

//T(hrush) combinator; Takes a value and applies a function to it. = R.applyTo thrush = Drossel (Vogel)
// a -> (a->b)->b takes in a value and returns a function that takes in a function that returns the value with the function applied
// thrush reverses function application
const T = (x) => (f) => f(x);
const T42 = T(42);
T42((a) => a + 1); // 43

// (curried) f must be a function that returns a function
// can't find a definition outside the course?
const D = (f) => (x) => (g) => (y) => f(x)(g(y));

//S(ubstitution) (or split) combinator
// input: function that returns a function
// (a → b → c) → (a → b) → a → c
const S_uncurried = (f) => (g) => (x) => f(x)(g(x));
const S = R.curry(S_uncurried);
//greeting :: Str -> Str
const greeting = R.concat('Greetings, '); //greeting('Joe') -> "Greetings, Joe"

// nameArr :: Obj -> Str
//const nameArr = (name) => [R.prop('first', name), R.prop('last', name)];
// const nameArr = (x) =>
//   R.prepend(R.prop('first')(x))(B(Array)(R.prop('last'))(x));

// this doesn't work even though copied from course code
const nameArr = S(B(R.prepend)(R.prop('first')), B(Array)(R.prop('last')));

// userGreeting :: User -> Str
// const userGreeting = I;
// const userGreeting = (user) =>
//   R.concat('Greetings, ')(
//     R.concat(user.name.first)(R.concat(',', user.name.last))
//   );
// const userGreeting = (user) =>
//   greeting(R.concat(user.name.first)(R.concat(' ', user.name.last)));
const userGreeting = compose(greeting, R.join(' '), nameArr, R.prop('name'));
//*******************************************************************************
//added functions during refactoring
// predicate :: String -> User -> Bool
//const predicate = (id) => (user) => R.prop('id', user) === id;
//const predicate = (id) => (user) => D(R.equals)(id)(R.prop('id'))(user);
//const predicate = (id) => C(D(R.equals)(id)(R.prop('id')));

// const predicate = C(D(R.equals))(R.prop('id')); // now point (argument-) free

// every combinator used here can be constructed only with S and K combinators:
//const predicate = S(S(K(S(K(S))(K)))(S))(K(K))(S(K(S(K(S))(K)))(R.equals))(R.prop('id'));
// same as const predicate = R.propEq('id'); // which will be used below

// data :: [User]
const data = getData();
//T(data)(console.log);

//******************************************************************************
//const predicate = property => user => userproperty in user
// getUserById :: Str -> User
// commented refactoring chain
//const getUserById = (id) => R.head(R.filter((user) => R.prop('id', user) === id)(getData()));
//const getUserById = (id) => R.head(R.filter(predicate(id))(getData()));
//const getUserById = (id) => R.head(R.filter(predicate(id))(data));
//const getUserById = (id) => R.head(T(data)(R.filter(predicate(id))));
//const getUserById = compose(R.head, T(data), R.filter, predicate);
const getUserById = compose(R.head, T(data), R.filter, R.propEq('id'));

// main :: String -> String
const main = compose.log(userGreeting, getUserById);
main(1);
 */

// final code from course material
const B = (f) => (g) => (x) => f(g(x));
const D = (f) => (x) => (g) => (y) => f(x)(g(y));
const S = R.curry((f, g, x) => f(x)(g(x)));
const K = (x) => (y) => x;
const I = (x) => x;
const C = (f) => (x) => (y) => f(y)(x);
const T = R.curry((x, f) => f(x));

const data = R.reverse(getData());

// getUserById :: String -> User
const getUserById = R.compose(R.head, T(data), R.filter, R.propEq('id'));

// greeting :: String -> String
const greeting = R.concat('Greetings, ');

// nameArr :: Obj -> Ar
const nameArr = S(B(R.prepend)(R.prop('first')), B(Array)(R.prop('last')));

// userGreeting :: User -> String
const userGreeting = compose(greeting, R.join(' '), nameArr, R.prop('name'));

// main :: String -> String
const main = compose.log(userGreeting, getUserById);
main(1);
