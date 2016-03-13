import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import { routeReducer } from 'react-router-redux'
import { reducer as formReducer, actionTypes as formActions } from 'redux-form'
import { handleActions, handleAction } from 'redux-actions'
import update from 'react-addons-update'

import Moment from 'moment'

import { validateFatture, RFC3339Nano } from 'utils'

import {ADD_INVOICE, UPDATE_INVOICE, REMOVE_INVOICE, SELECT_INVOICE} from 'actions'

let invoicesReducer = handleActions({
    [ADD_INVOICE]: {
        next(state, action) {
            const { name, sha256, type, select } = action.payload;
            const defaultValues = {
                // docid: 'defaultDocName',
                closingDate: Moment().utc().format(RFC3339Nano),  // CAVEATS: Moments replace Z with "UTC" or "+00:00"... see: https://www.ietf.org/rfc/rfc3339.txt
                filename: name,
                mimetype: type ? type : 'text/xml',
                sha256,
            }

            return update(state, {
                data: {
                    $push: [{
                        ...defaultValues,
                        error: validateFatture(defaultValues),
                    }]
                },
                selected: { $set: select ? state.data.length : state.selected }
            })
        },
        throw(state, action) {
            
        }
    },
    [REMOVE_INVOICE]: {
        next(state, action) {
            const { index } = action.payload
            let data = state.data.filter((item, i) => {return i !== index })
            let selected = data.length
            return {
                ...state,
                data,
                selected
            }
        }
    },
    [SELECT_INVOICE]: {
        next(state, action) {
            return {
                ...state,
                selected: action.payload.index
            }
        }
    },
    [formActions.CHANGE]: {
        next(state, action) {
            if (action.form !== 'fatture' || state.selected >= state.data.length) {
                return state;
            }

            const { field, value } = action

            let newData = {
                ...state.data[state.selected],
                [field]: value
            }

            return update(state, {
                data: {
                    [state.selected]: {
                        $set: {
                            ...newData,
                            error: validateFatture(newData)
                        }
                    }
                }
            })
        }
    }

}, {
    selected: 0,
    data: []
})

const rootReducer = combineReducers({
  routing: routeReducer,
  form: formReducer,
  invoices: invoicesReducer
})


export default rootReducer