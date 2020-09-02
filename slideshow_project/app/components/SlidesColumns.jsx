import dom, { fromHTML } from "../utils/dom";
import { K } from "../utils/combinators";
import R from "ramda";

// columnClass :: Bool -> String
const columnClass = R.ifElse(
  R.equals(true),
  K("fullscreen presentation"), // argument has to be a function, that's why K is used (just returns the argument every time)
  K("presentation")
);

// slideClass :: Slide -> String
const slideClass = (slide) => `slide ${!slide.active ? "" : "active"}`;

// Img :: Obj -> VNode
const Img = ({ src, alt = "" }) => <img src={src} alt={alt} />;

// Slide ::
export const Slide = (slide) => (
  // don't inject styles like this in production
  <div style={slide.style} className={slideClass(slide)}>
    <div className="header">
      <div className="header title">
        <h3 className="display-4">
          <strong className="lead">
            {slide.id}/{slide.order || 0}
          </strong>{" "}
          - {slide.title || ""}
        </h3>
      </div>
    </div>
    <div className="body">{slide.html ? fromHTML(slide.html) : null}</div>
    <div className="img img-responsive">
      {slide.img ? Img(slide.img) : null}
    </div>
    <footer className="footer">
      {slide.text ? <blockquote>{slide.text}</blockquote> : null}
    </footer>
  </div>
);
// Column :: [Slide] -> VNode
export const Column = ({ slides, fullscreen = false }) => (
  <div className={columnClass(fullscreen)}>{R.map(Slide, slides)}</div>
);
