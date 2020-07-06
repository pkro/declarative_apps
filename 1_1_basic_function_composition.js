const { expect } = require('chai');
const R = require('ramda');
const { prop, compose } = R;
const { log } = console;

/************************************************************************************/
// Function composition

const user1 = { name: 'Mike', email: 'mike@example.com' };
const sayHello = (toWhom) => `Hello ${toWhom}`;
const getName = (user) => user.name;

// WITHOUT composition
const greeting = (user) => sayHello(getName(user));
log(greeting(user1));

// WITH composition
//                            <--- evaluation pipeline---
const composedGreeting = compose(sayHello, getName);
log(composedGreeting(user1));

// prop function
// returns a function that returns the property with name name from an object
// minimal own implementation w/o error checking
const myProp = (propName) => (obj) => obj[propName];
const getNameProp = prop('name');
const getNamePropRamda = myProp('name');

expect(getNameProp(user1)).to.equal(getNamePropRamda(user1));

// The Ramda implementation can alternatively be used with both arguments at once (uncurried)
expect(prop('name', user1)).to.equal('Mike');

// Point free programming (don't explicitly define arguments to pass into a function)
const sayHelloPF = R.concat('Hello ');
const getNamePF = prop('name'); // same, just for better reading
const greetingPF = compose(sayHelloPF, getNamePF);
log(greetingPF(user1));
log(greetingPF({ name: 'World' }));

// the same with inlining the functions
//            <-----+----------------+----------+-- right to left / eager evaluation
log(compose(R.concat('Hello '), prop('name'))(user1)); // Hello Mike

// Example compose implementation with just 2 functions
const compose2 = (f, g) => (x) => f(g(x));
const add1ThenSquare = compose2(
  (x) => x * x,
  (x) => x + 1
);

log(add1ThenSquare(1)); // 4

// Composition is basically a refactoring of a nested call strucure
