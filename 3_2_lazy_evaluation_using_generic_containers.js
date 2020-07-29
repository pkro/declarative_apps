const R = require('ramda');
const { log } = console;

class IOContainer {
  constructor(fn) {
    this.value = fn;
    if (R.not(R.is(Function, fn))) {
      throw `IOContainer expects a function, actual: ${R.type(fn)}`;
    }
  }

  // IOContainer isn't a collection, so the map function can be thought of mapping over a 1-item array
  // contrary to Array.map, this one is lazily evaluated - functions are only ran when perform() is run
  // map :: (IOContainer io) => io (a -> b) ~> (b -> c) -> io (b -> c)
  // map(fn) {
  //   return new IOContainer(() => fn(this.value()));
  // }

  //refactored to optional use promises (why?)
  map(fn) {
    const val = this.value();
    return new IOContainer(() =>
      R.is(Promise, val) ? val.then(fn) : fn(this.value())
    );
  }

  perform() {
    this.value();
  }
}

const rlog = R.tap(console.log);

const lazy = new IOContainer(function () {
  return 'hello';
});

// nothing is evaluated here (except the return value of the function that returns hello)
// const work = lazy.map(rlog).map(R.concat(R.__, 'world')).map(rlog);

// evaluation starts here, when the code is acutall run
// work.perform();

// this doesn't work and I don't understand it.
const lazyPromise = new IOContainer(function () {
  return new Promise((resolver) => {
    setTimeout(resolver, 1000, 'Hello from prom');
  });
});

const work2 = lazy.map(rlog).map(R.concat(R.__, 'world')).map(rlog);

work2.perform();
debugger;
