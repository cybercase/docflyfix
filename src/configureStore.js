import { createStore, applyMiddleware } from 'redux'
import { hashHistory } from 'react-router'

import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import createLogger from 'redux-logger'
import rootReducer from 'reducers'
import { syncHistory } from 'react-router-redux'

const loggerMiddleware = createLogger()
const reduxRouterMiddleware = syncHistory(hashHistory)

export default function configureStore(initialState) {
  let middlewares = [thunkMiddleware,
      promiseMiddleware,
      reduxRouterMiddleware
  ];

  if (__DEBUG) {
    middlewares.push(loggerMiddleware)
  }

  let store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  )

  reduxRouterMiddleware.listenForReplays(store);

  return store;
}