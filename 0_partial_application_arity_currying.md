**Arity**
- number of arguments that a function uses
- stored in length property of function object

**Point free programming**
- programming paradigm in which function definitions do not identify arguments ("points" ) on which they operate
- example:
  
    const x = books.filter(point => isTechnology(point)) // NOT point free
    const x = books.filter(isTechnology) // point free

**Reminder: arrow functions**
- don't get hoisted
- context (this) is the context in which they are defined, not the one they are called in
- don't get "hoisted", so they can't be called before they are defined in the code
- don't have an arguments object

**Currying**

Basic / using closure:

    function sumCurry(a) {
      return (b) => {
        return a + b;
      };
    }

    const add5 = sumCurry(5);
    const result = add5(15); // -> 20


With alternative for normal calling:

    function sumCurryOrNot(a, b) {
      if (arguments.length === sumCurryOrNot.length) {
        return a + b;
      }

      // otherwise return new function with its first argument already bound to a (first implicit argument is context ("this"))
      return sumCurryOrNot.bind(null, a);

      //same result using closures (a is accessible as a closure variable to the new function):
      //return (b) => {
      //  return a + b;
      //};
    }

    expect(sumCurryOrNot(5, 10)).to.equal(15);
    expect(sumCurryOrNot(5)(20)).to.equal(25);

Curry any existing function:

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
