import R from "ramda";
// mainRecucer :: (Object, Object) -> Object
export default function mainReducer(state, action) {
  switch (action.type) {
    case "TEST_ACTION":
      //return R.merge(state, {title: 'Packt Pub Presentation App'})
      return { ...state, title: "PAckt pub presentation app" };
    case "CUSTOM_TITLE":
      const title = action.value;
      return { ...state, title };
    case "DEPOSIT":
      //return R.over(R.lensProp("money"), R.add(action.value), state);
      return { ...state, money: state.money + action.value }; // same (?)
    case "WITHDRAW":
      const money = state.money - action.value;
      return { ...state, money };
    default:
      return state;
  }
}
