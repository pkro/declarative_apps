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
    default:
      return state;
  }
}

const { getState, dispatch, subscribe } = createStore(
  mainReducer,
  initialState
);

// setItem :: (Str, *) -> IOContainer
const setItem = (key, val) => {
  return IOContainer.of(() => {
    localStorage.setItem(key, JSON.stringify(val));
  });
};

// getItem :: (Str) -> IOContainer
const getItem = (itemKey) =>
  IOContainer.of(() => localStorage.getItem(itemKey));

// groupByProp :: Str -> [Obj] -> [[Obj]]
const groupByProp = (key) =>
  R.compose(R.groupWith(R.eqProps(key)), R.sortBy(R.prop(key)));

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
// setupSlides :: (Mappable m) => m Str -> m [[Object]]
const setupSlides = compose(
  R.set(R.lensPath(["slides", 0, 0, "active"]), true),
  R.over(R.lensProp("slides"), R.map(R.sortBy(R.prop("order")))),
  R.over(R.lensProp("slides"), groupByProp("id")),
  JSON.parse
);

setItem("slides", slides).perform();

getItem("slides").map(setupSlides).map(update).perform();
