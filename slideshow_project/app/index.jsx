import "./styles/main.scss";
import dom, { renderDOM } from "./utils/dom";
import compose from "./utils/compose";
import { IOContainer } from "./utils/containers";
import slides from "./data/slides";
import Slideshow from "./components/Slideshow";
import R from "ramda";

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

// setupSlides :: (Mappable m) => m Str -> m [[Object]]
const setupSlides = compose(
  R.set(R.lensPath(["slides", 0, 0, "active"]), true),
  R.over(R.lensProp("slides"), R.map(R.sortBy(R.prop("order")))),
  R.over(R.lensProp("slides"), groupByProp("id")),
  JSON.parse
);

setItem("slides", slides).perform();

getItem("slides").map(setupSlides).map(update).perform();
