import { combineReducers, createStore } from "redux";
import userEventsReducer from "./user-events";

const rootReducer = combineReducers({
    userEvents: userEventsReducer
})
export type rootState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer);
export default store