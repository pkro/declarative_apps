# My course notes and code for the "Building Declarative Apps Using Functional JavaScript" course on linkedin by Michael Rosata
## For notes for the previous course this one builds on, see https://github.com/pkro/functional_javascript_mrosata


## 0 setting up node for the course

**Setting up mocha / chai**

    npm i -D mocha chai

**Set up nodemon to make like easier**

    npm i -D nodemon

**Add script to package.json to easily start continuously running scripts**

    "start": "nodemon $*"
    "debug": "nodemon --debug $*"

run with

    npm run start 0_setup_node.js

**Import expect from chai in files to test / assert**

    const { expect } = require('chai');
    expect(20 + 20).to.equal(41);

_Note: passing expect doesn't produce output, only failing - same as assert_


## Reminder partial application and currying

**Arity**
- number of arguments that a function uses
- stored in length property of function object

**Point free programming**
- programming paradigm in which function definitions / usage do not identify arguments ("points" ) on which they operate
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


## 1_1 Basic function composition

  **Higher Order functions**
- takes other functions as input and / or return functions as output

**Pure functions**
- take ONE argument 
- return ONE value (can also be an object or array, it just must be assignable to one variable)
- return the same output for the same input 
- have no side effects like logging, DB access or similar
  
**Function composition**
- passes output of function in the input of another function in a function chain

      compose(a,b)
      ->
      function composedAB(someInput) {
        const result = B(someInput);
        return A(result);
      }

**Point free programming**
- we don't explicitly define arguments to pass into a function

**Javascript uses Eager evaluation**
- evaluation from inside out / right to left
  
      f(g(h(x)))
  Evaluation order: h(x) -> g(result) -> f(result)

**Composition**

Composition is basically a refactoring of a nested call strucure

  **f**(**g**(**h**(x)))

  -> Remove paranthesis

  f g h

  -> 

  compose(**f,g,h**)(x)

## 1_2 implement n-length composition with reduce

  **Standard js implementation of reduce**
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
    log(test(1)); // 104


**Ramda implementation using R.reduce**

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

**Ramda implementation using R.reduceRight**

    function composeR(...fns) {
      return (x) => {
        return R.reduceRight(
          // reduce function parameters are switched!!!
          (fn, output) => {
            return fn(output);
          },
          x,
          fns
        );
      };
    }

  
***fold and reduce / foldRight and reduceRight are synonymous and have always oposite parameters in the left / right versions***

**Composed functions can be used in a new composition like normal functions**


## 1_3 formalizing types with henry-milner notation

**Hilney Milner**

- language to formalize type inference
- getNeedle :: HayStack -> String
- - "::" = "is of type"
- - "HayStack -> String" = is a function that returns a String
- - in full: Haystack is of the type of function that returns a string


## 1_4 refactor using laws of composition

**Mathematical laws**


**Laws of Compositionality**

## 2_1 Combinators

**Definition**

- pure function (no side effects / no reliance on variables outside scope / same in produces same out) that doesn't have any free variables (variables within scope of the function that aren't explicitely passed in as arguments)
- combinators are a means to an end and not a merit in itself
- Don't use if it makes code more complex or more difficult to read

## 2_2 Tap to inspect composition

- Inspecting composition can be difficult
- debugging at function level can be inflexible / bloat code
- console log in function is a side effect we want to avoid
- putting console.log in the composition chain breaks it as it doesn't return anything
  
Solution: tap

    const tap = curry((prefix, val) => {
      console.log(`${prefix}: ${val}`);
      return val;
    });


## 2_3 non-linera composition using join combinators

Combinator defintitions see https://gist.github.com/Avaq/1f0636ec5c8d6aed2e45

**K-Combinator**

**S-Combinator**

**D-Combinator**


## 2_4 Using combinators with partially applied higher order functions

**Control flow combinators**
- or combinator
  
      //or :: (a -> b,  a -> c) -> a -> b|c 
      const or = (f, g) => (x) => f(x) || g(x);
    
    = Ramda.either

- ifElse combinator
  
      // ifElse :: (a -> Bool, a -> b, a -> c) -> a -> b|c
      const ifElse = (f, g, h) => (x) => (f(x) ? g(x) : h(x));
    
    = Ramda.ifElse

- when combinator
  
      // when :: (a -> Bool, a -> b) -> a -> a|b
      const when = (f, g) => ifElse(f, g, I);
      // I = identity (just return input)
    
    = Ramda.when

- conditions combinator

      // conditions :: [[a -> Bool, a -> *]] -> a -> *
      // example implementations see code file for lesson
      
    = Ramda.cond

**Ramda lenses**
https://randycoulman.com/blog/2016/07/12/thinking-in-ramda-lenses/
- basically provide getters and setters for object properties and returns a new object with the focused property updated
- lensProp - creates lens that focuses on a property of an object
- lensPath - lens on nested property
- lensIndex - lens on element of an array
- "getters": view
- "setters": set, over

      const headLens = R.lensIndex(0);

      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']

**Ramda functions can all be used curried or uncurried**


## 3_1 Encapsulate IO using generic containers

**Reminder quicky node setup for web dev**

    npm install -D webpack webpack-cli webpack-dev-server html-webpack-plugin @babel/core @babel/preset-env babel-loader 
    npm install @babel/runtime core-js@3
    npm install ramda [...]

package.json:

    [...]
    "scripts": {
        "dev": "webpack --mode development",
        "build": "webpack --mode production",
        "start": "webpack-dev-server --mode development --open"
      },
    [...]

.babelrc:

    {
      "presets": [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": "usage",
            "corejs": "3",
            "targets": {
              "browsers": ["last 5 versions", "ie >= 8"]
            }
          }
        ]
      ]
    }

webpack.config.js

    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
      entry: './src/index.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
      },
      devServer: {
        contentBase: './dist',
      },
      plugins: [
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: './src/index.html',
        }),
      ],
      module: {
        rules: [
          {
            test: /\.js$/, //using regex to tell babel exactly what files to transcompile
            exclude: /node_modules/, // files to be ignored
            use: {
              loader: 'babel-loader', // specify the loader
            },
          },
        ],
      },
    };


## 3_1 Encapsulatio IO using generic containers

**Generic containers**
- used for encapsulating I/O
- protect functional code from impurities (side effects)
- Hide and contain impurities
  - we could model results of impure operations (DOM manipulation) to have a virtual DOM and then have oner containerized impurity to do something impure (rendering to the actual DOM)
  
## 3_2 Lazy evaluation using generic containers
