import R from "ramda";
import { setupSlides, activeSlide } from "../utils/slide-utils";
// mainRecucer :: (Object, Object) -> Object
export default function mainReducer(state, action) {
  const { type, value } = action;
  switch (action.type) {
    case "MOVE_TO_SLIDE":
      const slidePos = value;
      const slides = state.presentation.slides || [];
      return R.mergeDeepRight(state, {
        presentation: { slidePos, slides: activeSlide(slidePos)(slides) },
      });
    case "SETUP_SLIDES":
      const presentation = {
        ...state.presentation,
        slides: setupSlides(action.value),
      };
      return { ...state, presentation };
    case "CHANGE_SETTING":
      // takes tuple ['settingname', val] and merges object {settinName: val}
      // into state.settings
      // R.mergeDeepRight: like {...state, action.value} spread, but merges recursively into object (here: state)
      return R.mergeDeepRight(state, {
        settings: R.apply(R.objOf)(value),
      });

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
