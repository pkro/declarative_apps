import dom, { renderDOM } from "./utils/dom";
import { compose } from "./utils/compose";
import { IOContainer } from "./utils/containers";

renderDOM((state) => {
  return (
    <div className="container">
      <h2 className="title">Welcome to Volume II</h2>
    </div>
  );
}, document.getElementById("packtPubApp"));
