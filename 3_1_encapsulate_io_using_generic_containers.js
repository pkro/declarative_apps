// see folder for runnable webpack code
const R = require('ramda');
const { compose } = require('../../functional_utilities');
const { S, B, T, I, K, C } = require('../../combinators');
const { log } = console;

// insertHTML :: Str -> Str -> Undefined
const insertHTML = R.curry((selector, html) => {
  const elem = document.querySelector(selector);
  if (elem) {
    elem.innerHTML = html;
  }
});

//impure as we don't know the current state of the DOM
insertHTML('#packtPubApp', '<h1 class="message"></h1>');
insertHTML('.message', 'hello world!!!');
insertHTML('#packtPubApp', '<svg id="mySVG"><circle r=100 fill=black /></svg>');

//insertHTML('.message', 'hello world!!!'); // error as ".message" doesn't exist anymore

class IOContainer {
  constructor(fn) {
    this.value = fn;
    if (R.not(R.is(Function, fn))) {
      throw `IOContainer expects a function, actual: ${R.type(fn)}`;
    }
  }
  perform(fn) {
    const val = this.value();
    if (R.is(Function, fn)) {
      return fn(val);
    }
  }
}

const io_impure = new IOContainer(() =>
  insertHTML('#packtPubApp', '<h1 class="message">I am a side effect</h1>')
);
io_impure.value();

function iAmPure(selector, html) {
  return new IOContainer(function () {
    const elem = document.querySelector(selector);
    if (elem) {
      elem.innerHTML = html;
    }
  });
}

// pure function doesn't do anything and just return an (predictable) object, which is fine
const io = iAmPure(
  '#packtPubApp',
  '<h1 class="message">Safe and sound inside container</h1>'
);
io.perform();

const io2 = new IOContainer(function () {
  return document.querySelector('h1').innerHTML;
});

io2.perform(console.log); // logs Safe and sound inside container
