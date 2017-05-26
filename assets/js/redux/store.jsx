import { createStore, combineReducers, applyMiddleware } from "redux";

import { rootReducer } from "./reducers";









const store = createStore(rootReducer);

module.exports = {  store }