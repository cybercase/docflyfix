import { createStore, applyMiddleware } from 'redux'
import { hashHistory } from 'react-router'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import createLogger from 'redux-logger'
import { syncHistory } from 'react-router-redux'

import rootReducer from 'reducers/root'

const loggerMiddleware = createLogger()
const reduxRouterMiddleware = syncHistory(hashHistory)

export default function configureStore() {
  let middlewares = [thunkMiddleware,
      promiseMiddleware,
      reduxRouterMiddleware
  ];

  if (__DEBUG) {
    middlewares.push(loggerMiddleware)
  }

  let initialState = {}
  if (window.localStorage.docflyFixData) {
    initialState = JSON.parse(window.localStorage.docflyFixData);
  }

  let store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  )

  reduxRouterMiddleware.listenForReplays(store)

  window.onbeforeunload = (e) => {
    window.localStorage.docflyFixData = JSON.stringify(store.getState());
  }

  return store;
}