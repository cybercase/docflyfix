import { createAction } from 'redux-actions'
import hash from 'hash.js'


export const SELECT_INVOICE = 'SELECT_INVOICE';
export const REMOVE_INVOICE = 'REMOVE_INVOICE';
export const ADD_INVOICE = 'ADD_INVOICE';
export const RESET_INVOICE = 'RESET_INVOICE';

export const SELECT_NOTICE = 'SELECT_NOTICE';
export const REMOVE_NOTICE = 'REMOVE_NOTICE';
export const ADD_NOTICE = 'ADD_NOTICE';
export const RESET_NOTICE = 'RESET_NOTICE';

export const selectInvoice = createAction(SELECT_INVOICE)
export const removeInvoice = createAction(REMOVE_INVOICE)
export const resetInvoice = createAction(RESET_INVOICE)

export const selectNotice = createAction(SELECT_NOTICE)
export const removeNotice = createAction(REMOVE_NOTICE)
export const resetNotice = createAction(RESET_NOTICE)


//TODO: Maybe remove duplicated code in addInvoice/addNotice ?
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

export const addNotice = (payload) => {
    const helper = createAction(ADD_NOTICE);

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