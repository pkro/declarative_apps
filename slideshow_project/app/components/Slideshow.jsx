import dom from "../utils/dom";
import R from "ramda";
import { Column } from "./SlidesColumns";

export default ({ slides = [], settings = {} }) => {
  return (
    <div>
      {R.map(
        (colSlides) => (
          <Column
            fullscreen={R.prop("fullscreen", settings)}
            slides={colSlides}
          />
        ),
        slides
      )}
    </div>
  );
};
