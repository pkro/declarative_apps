import R from "ramda";

// returns a new api
export default R.curry((createStore, reducer, initState) => {
  const actionHistory = [];
  const store = createStore((state, action) => {
    switch (action.type) {
      case "@@/JUMP":
        return R.reduce(
          // loops through all actions up to in ar given by the slice in window.changeState below
          (accState, nextAction) => {
            console.log(nextAction.type, nextAction.value);
            return reducer(accState, nextAction);
          },
          initState,
          action.value
        );
      default:
        return reducer(state, action);
    }
  }, initState);
  // don't do this, just to demo rewinding in the browser console
  window.changeState = (i) => {
    actionHistory[i] &&
      dispatch({ type: "@@/JUMP", value: R.slice(0, i, actionHistory) });
  };

  const middleDispatch = (action) => {
    store.dispatch(action);
    actionHistory.push(action);
    console.log(actionHistory);
  };
  return {
    getState: store.getState,
    dispatch: middleDispatch,
    subscribe: store.subscribe,
  };
});
