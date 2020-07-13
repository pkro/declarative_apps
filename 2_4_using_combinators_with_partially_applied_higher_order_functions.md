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