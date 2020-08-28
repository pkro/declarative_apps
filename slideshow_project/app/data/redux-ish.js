"use strict";
import R from "ramda";
import colorLog from "utils/colorLog";

const logAction = colorLog("Action", "rgb(179,63,132)");
const logCurrentState = colorLog("State: ", "orange");
const logNextState = colorLog("State: ", "blue");

// State :: Object
// Action :: Object {type}
// Store :: Object {subscribe, dispatch, getState}
// createStore :: ((Action -> State), State) -> Store
export function createStore(reducer, state, middleware) {
  // these will not be changed internally but let is used to be able to reassign
  let currentState = state;
  let currentSubscribers = [];
  let nextSubscribers = [];
  let isDispatching = false;

  if (R.is(Function, middleware)) {
    return middleware(createStore)(reducer, state);
  }
  const getState = () => currentState;

  const subscribe = (listenerFn) => {
    nextSubscribers = nextSubscribers.slice(0); // or just [...nextSubscribers] to copy, slice(0) is fastest method
    nextSubscribers.push(listenerFn);
  };

  const dispatch = (action) => {
    if (isDispatching) {
      throw new Error("Dispatch should never be called inside a reducer");
    }
    isDispatching = true;

    try {
      const nextState = reducer(currentState, action);
      logAction(action);
      logCurrentState(currentState);
      logNextState(nextState);

      currentState = nextState;
    } finally {
      isDispatching = false;
    }

    currentSubscribers = nextSubscribers;
    R.map(R.call, currentSubscribers); // call all functions in currentSubscribers list
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
}
