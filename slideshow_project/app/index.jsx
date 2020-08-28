import "./styles/main.scss";
import dom, { renderDOM } from "./utils/dom";
import compose from "./utils/compose";
import { IOContainer } from "./utils/containers";
import slides from "./data/slides";
import Slideshow from "./components/Slideshow";
import R from "ramda";
import { createStore } from "./data/redux-ish";
import mainReducer from "./data/reducers";
// initialState :: Object
const initialState = { title: "", slides: [] };

// returns a new api
const middleware = R.curry((createStore, reducer, initialState) => {
  const actionHistory = [];
  const store = createStore(reducer, initialState);

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

const { getState, dispatch, subscribe } = createStore(
  mainReducer,
  initialState,
  middleware
);

const update = renderDOM((state) => {
  console.log("State @render ---> ", state);
  return (
    <div className="container">
      <h2 className="title">{state.title}</h2>
      <Slideshow slides={state.slides || []} />
    </div>
  );
}, document.getElementById("packtPubApp"));

subscribe(() => {
  // this gets called from the store if data is updated
  update(getState());
});

dispatch({ type: "TEST_ACTION" });

let i = 0;
setInterval(() => {
  dispatch({
    type: ["TEST_ACTION", "CUSTOM_TITLE"][++i % 2],
    value: "We love functional programming",
  });
}, 10000);
