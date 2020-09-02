import dom from "../utils/dom";
import R from "ramda";
export default (props) => {
  const {
    dispatch,
    settings = {},
    presentation: { slides = [], slidePos = [0, 0] },
  } = props;

  const slidesLoaded = !!(slides && slides.length);
  const changeSetting = (setting, value) => {
    console.log(value);
    dispatch({ type: "CHANGE_SETTING", value: [setting, value] });
  };
  return (
    <aside className="slide-controls">
      <button
        className="btn btn-lg btin-info outline"
        onclick={
          () => changeSetting("fullscreen", !R.prop("fullscreen", settings)) // same as "!settings.fullscreen"
        }
      >
        <i
          className={`fa fa-${
            R.prop("fullscreen", settings) ? "compress" : "expand"
          }
        `}
        ></i>
        <span className="hidden">Up</span>
      </button>
    </aside>
  );
};
