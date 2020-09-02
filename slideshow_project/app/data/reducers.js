import R from "ramda";
import { setupSlides } from "../utils/slide-utils";
// mainRecucer :: (Object, Object) -> Object
export default function mainReducer(state, action) {
  switch (action.type) {
    case "SETUP_SLIDES":
      const presentation = {
        ...state.presentation,
        slides: setupSlides(action.value),
      };
      return { ...state, presentation };
    case "TEST_ACTION":
      //return R.merge(state, {title: 'Packt Pub Presentation App'})
      return { ...state, title: "PAckt pub presentation app" };
    case "CUSTOM_TITLE":
      const title = action.value;
      return { ...state, title };
    default:
      return state;
  }
}
