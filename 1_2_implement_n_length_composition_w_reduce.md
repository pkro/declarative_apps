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