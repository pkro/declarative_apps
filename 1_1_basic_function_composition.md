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