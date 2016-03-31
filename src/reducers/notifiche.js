import { handleActions, handleAction } from 'redux-actions'
import { actionTypes as formActions } from 'redux-form'
import update from 'react-addons-update'
import Moment from 'moment'

import { validateNotifiche, RFC3339Nano } from 'utils'
import { ADD_NOTICE, REMOVE_NOTICE, SELECT_NOTICE, RESET_NOTICE } from 'actions'

const defaultState = {
    selected: 0,
    data: []
}

// TODO: Maybe there's a better way than just copy&paste the invocesReducer...
// Let's wait to see how notices work before refactoring/merging the 2 reducers
export default handleActions({
    [RESET_NOTICE]: (state, action) => {
        return defaultState
    },
    [ADD_NOTICE]: {
        next(state, action) {
            const { name, sha256, type, select } = action.payload;
            const defaultValues = {
                // docid: 'defaultDocName',
                closingDate: Moment().utc().format(RFC3339Nano),
                filename: name,
                mimetype: type ? type : 'text/xml',
                sha256,
            }

            return update(state, {
                data: {
                    $push: [{
                        ...defaultValues,
                        error: validateNotifiche(defaultValues),
                    }]
                },
                selected: { $set: select ? state.data.length : state.selected }
            })
        },
        throw(state, action) {
            console.error(state, action)
        }
    },
    [REMOVE_NOTICE]: {
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
    [SELECT_NOTICE]: {
        next(state, action) {
            return {
                ...state,
                selected: action.payload.index
            }
        }
    },
    [formActions.CHANGE]: {
        next(state, action) {
            if (action.form !== 'notifiche' || state.selected >= state.data.length) {
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
                            error: validateNotifiche(newData)
                        }
                    }
                }
            })
        }
    }

}, defaultState)