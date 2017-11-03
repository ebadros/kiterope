import { createStore, combineReducers, applyMiddleware } from "redux";
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import {Router, Route, Link, hashHistory, browserHistory} from 'react-router'

const middleware = routerMiddleware(browserHistory);


import { rootReducer } from "./reducers";

//const store2 = createStore(rootReducer);

const reducer = combineReducers({
      rootReducer: rootReducer,
      routing: routerReducer,}
  );

const store = createStore(
    reducer,
    applyMiddleware(middleware)
);

module.exports = {  store };