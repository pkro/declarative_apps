export function curry(func) {
  return (...args) => {
    if (args.length >= func.length) {
      return func.apply(null, args); // apply passes array values as individual parameters (_A_pply passes _A_rray)
    }
    return curry(func.bind(null, ...args));
  };
}
