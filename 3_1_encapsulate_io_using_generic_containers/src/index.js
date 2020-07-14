const R = require('ramda');
const { compose } = require('../../functional_utilities');
const { S, B, T, I, K, C } = require('../../combinators');
const { log } = console;

// insertHTML :: Str -> Str -> Undefined
const insertHTML = R.curry((selector, html) => {
  const elem = document.querySelector(selector);
  elem.innerHTML = html;
});

insertHTML('#packtPubApp', '<h1>yay</h1>');
