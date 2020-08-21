import "./styles/main.scss";
import dom, { renderDOM } from "./utils/dom";
import compose from "./utils/compose";
import { IOContainer } from "./utils/containers";
import slides from "./data/slides";
import Slideshow from "./components/Slideshow";
import R from "ramda";
import { createStore } from "./data/redux-ish";

// initialState :: Object
const initialState = { title: "", slides: [] };

// mainRecucer :: (Object, Object) -> Object
function mainReducer(state, action) {
  switch (action.type) {
    case "TEST_ACTION":
      //return R.merge(state, {title: 'Packt Pub Presentation App'})
      return { ...state, title: "PAckt pub presentation app" };
    case "CUSTOM_TITLE":
      const title = action.value;
      return { ...state, title };
    default:
      return state;
  }
}

const { getState, dispatch, subscribe } = createStore(
  mainReducer,
  initialState
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
