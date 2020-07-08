- Inspecting composition can be difficult
- debugging at function level can be inflexible / bloat code
- console log in function is a side effect we want to avoid
- putting console.log in the composition chain breaks it as it doesn't return anything
  
Solution: tap

    const tap = curry((prefix, val) => {
      console.log(`${prefix}: ${val}`);
      return val;
    });