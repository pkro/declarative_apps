export function curry(func) {
  return (...args) => {
    if (args.length >= func.length) {
      return func.apply(null, args); // apply passes array values as individual parameters (_A_pply passes _A_rray)
    }
    return curry(func.bind(null, ...args));
  };
}

function compose() {
  const funcs = Array.from(arguments).reverse();
  return (val) => {
    return funcs.reduce((acc, func) => func(acc), val);
  };
}
