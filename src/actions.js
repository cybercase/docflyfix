import { createAction } from 'redux-actions'
import hash from 'hash.js'


export const SELECT_INVOICE = 'SELECT_INVOICE';
export const UPDATE_INVOICE = 'UPDATE_INVOICE';
export const REMOVE_INVOICE = 'REMOVE_INVOICE';
export const ADD_INVOICE = 'ADD_INVOICE';

export const selectInvoice = createAction(SELECT_INVOICE)
export const updateInvoice = createAction(UPDATE_INVOICE)
export const removeInvoice = createAction(REMOVE_INVOICE)

export const addInvoice = (payload) => {
    const helper = createAction(ADD_INVOICE);

    return (dispatch, getState) => {
        let reader = new FileReader()
        reader.readAsArrayBuffer(payload.file)

        reader.onload = (e) => {
            const fo = payload.file;
            let h = hash.sha256().update(new Uint8Array(reader.result)).digest()
            h = btoa(String.fromCharCode.apply(null, h))
            
            dispatch(helper({
                name: fo.name,
                sha256: h,
                type: fo.type,
                select: payload.select
            }))
        }

        reader.onerror = (e) => {
            alert('Impossibile caricare il file', e)
            // dispatch(helper({file: file.file, error: e}))
        }
    }
}

