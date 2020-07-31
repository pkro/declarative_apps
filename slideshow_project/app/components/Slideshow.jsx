import dom from "../utils/dom";
import R from "ramda";
import { Column } from "./SlidesColumns";

export default ({ slides }) => {
  console.log(slides);
  return (
    <div>
      <h2>Welcome to the slideshow</h2>
      <main className="container-fluid">{R.map(Column, slides)}</main>
    </div>
  );
};
