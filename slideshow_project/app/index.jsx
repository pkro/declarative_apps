import dom, { renderDOM } from "./utils/dom";
import { compose } from "./utils/compose";
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

const update = renderDOM((state) => {
  return (
    <div className="container">
      <h2 className="title">Welcome to Volume II</h2>
      <Slideshow />
    </div>
  );
}, document.getElementById("packtPubApp"));

setItem("slides", slides).perform();

getItem("slides")
  .map(JSON.parse)
  .map(R.tap(console.log))
  .map(function (presentation) {
    // we want a 2d array as we want to be able to move up/down between slides with the same id
    // slides with same id will be in same list
    const sorted = R.sortBy(R.prop("id"), R.prop("slides", presentation));
    return R.groupWith(R.eqProps("id"), sorted);
  })
  .map(R.tap(console.log))
  .perform();
