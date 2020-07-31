import dom, { fromHTML } from "../utils/dom";
import R from "ramda";

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
export const Column = (colSlides) => (
  <div className="presentation column">{R.map(Slide, colSlides)}</div>
);
