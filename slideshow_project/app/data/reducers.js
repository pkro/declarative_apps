// mainRecucer :: (Object, Object) -> Object
export default function mainReducer(state, action) {
  switch (action.type) {
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
