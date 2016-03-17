import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import { routeReducer } from 'react-router-redux'
import { reducer as formReducer, actionTypes as formActions } from 'redux-form'
import { handleActions, handleAction } from 'redux-actions'
import update from 'react-addons-update'

import invoicesReducer from './fatture';
import noticesReducer from './notifiche';


const rootReducer = combineReducers({
  routing: routeReducer,
  form: formReducer,
  invoices: invoicesReducer,
  notices: noticesReducer
})


export default rootReducer