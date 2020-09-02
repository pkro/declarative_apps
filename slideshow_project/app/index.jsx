import "./styles/main.scss";
import dom, { renderDOM } from "./utils/dom";
import compose from "./utils/compose";
import { IOContainer } from "./utils/containers";
import slides from "./data/slides";
import Slideshow from "./components/Slideshow";
import R from "ramda";
import { createStore } from "./data/redux-ish";
import mainReducer from "./data/reducers";
import middleware from "./utils/action-history-middleware";

// initialState :: Object
const initialState = {
  title: "",
  presentation: { slides: [], slidePos: [0, 0], settings: {} },
};

const { getState, dispatch, subscribe } = createStore(
  mainReducer,
  initialState,
  middleware
);

const update = renderDOM(
  (state) => {
    const {
      title,
      presentation: { slides, slidePos },
      settings,
    } = state;
    return (
      <div>
        <h2 className="title">{title}</h2>
        <Slideshow slides={slides || []} settings={settings} />
      </div>
    );
  },
  document.getElementById("packtPubApp"),
  initialState
);

subscribe(() => {
  // this gets called from the store if data is updated
  update(getState());
});

dispatch({ type: "CUSTOM_TITLE", value: "yay custom title" });
dispatch({ type: "SETUP_SLIDES", value: slides });
