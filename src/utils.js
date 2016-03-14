import Moment from 'moment'

// CAVEATS: Moments replace Z with "UTC" or "+00:00"... see: https://www.ietf.org/rfc/rfc3339.txt
export const RFC3339Nano = "YYYY-MM-DDTHH:mm:ss.SSSSSSSS[Z]" 

const VALIDATE = {
    MANDATORY: "Obbligatorio",
    INVALID_DATE: "Data non valida",
}

export let DATE_FORMATS = (() => {
    const formats = [
        'DD-MM-YYYY',
        'D-M-YYYY',
    ]

    let res = formats.slice(0)

    // For each separator in sep add a new date format into `res`.
    const sep = ['/', '\\', '.', ' ']
    for (let s of sep) {
        for (let f of formats) {
            res.push(f.replace(/\-/g, s))
        }
    }

    return res
})();


export function isValidDate(date) {
    const d = Moment(date, DATE_FORMATS, true)
    return d.isValid()
}

export function validateFatture(values) {
    let errors = {};

    // Mandatory
    if (!values.docid) {
        errors.docid = VALIDATE.MANDATORY
    }

    if (!isValidDate(values.dataDocumentoTributario)) {
        errors.dataDocumentoTributario = VALIDATE.INVALID_DATE
    }

    // Optional
    if (values.dataDocumento && !isValidDate(values.dataDocumento)) {
        errors.dataDocumento = VALIDATE.INVALID_DATE
    }

    return errors;
}

export function validateNotifiche(values) {
    let errors = {};

    // Mandatory
    if (!values.docid) {
        errors.docid = VALIDATE.MANDATORY
    }

    if (!isValidDate(values.dataDocumentoTributario)) {
        errors.dataDocumentoTributario = VALIDATE.INVALID_DATE
    }

    // Optional
    if (values.dataDocumento && !isValidDate(values.dataDocumento)) {
        errors.dataDocumento = VALIDATE.INVALID_DATE
    }

    return errors;
}

