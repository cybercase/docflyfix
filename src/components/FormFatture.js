import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import classNames from 'classnames'

import { validateFatture } from 'utils'

import formFattureStyle from './FormFatture.css'


const FILE_FIELDS = [
    // File
    {id: 'docid', label: 'ID Documento', hidden: true},
    {id: 'mimetype', label: 'mimetype', hidden: true},
    {id: 'filename', label: 'Filename', hidden: true},
    {id: 'sha256', label: 'sha256', hidden: true},
    {id: 'closingDate', label: 'Data Chiusura', hidden: true, placeholder: 'gg/mm/anno'},
]

const BASIC_FIELDS = [
    // Doc
    {id: 'docid', label: 'ID Documento', mandatory: true},
    {id: 'dataDocumento', label: 'Data Documento', placeholder: 'gg/mm/anno'},
    {id: 'dataDocumentoTributario', label: 'Data Documento Tributario', mandatory: true, placeholder: 'gg/mm/anno'},
    {id: 'oggettodocumento', label: 'Oggetto Documento'},
]

const PRODUCER_FIELDS = [
    // Producer
    {id: 'prod_codicefiscale', label: 'Codice Fiscale'},
    {id: 'prod_cognome', label: 'Cognome'},
    {id: 'prod_denominazione', label: 'Denominazione'},
    {id: 'prod_nome', label: 'Nome'},
    {id: 'prod_partitaiva', label: 'Partita Iva'},
]

const CONSUMER_FIELDS = [
    // Consumer
    {id: 'con_codicefiscale', label: 'Codice Fiscale'},
    {id: 'con_cognome', label: 'Cognome'},
    {id: 'con_denominazione', label: 'Denominazione'},
    {id: 'con_nome', label: 'Nome'},
    {id: 'con_partitaiva', label: 'Partita Iva'},
]

const TAX_FIELDS = [
    // Tax
    {id: 'tax_codicefiscale', label: 'Codice Fiscale'},
    {id: 'tax_cognome', label: 'Cognome'},
    {id: 'tax_denominazione', label: 'Denominazione'},
    {id: 'tax_nome', label: 'Nome'},
    {id: 'tax_partitaiva', label: 'Partita Iva'},
]

const EXTRA_FIELDS = [
    // Extra
    {id: 'allegato1', label: 'Allegato 1'},
    {id: 'allegato2', label: 'Allegato 2'},

    {id: 'applicativoProduzione', label: 'Applicativo di produzione del documento'},
    {id: 'cfTitolareFirma', label: 'Codice fiscale titolare del certificato di firma'},
    {id: 'codiceTopologia', label: 'Codice tipologia documento'},
    {id: 'condizioniAccesso', label: 'Condizioni di accesso'},
    {id: 'esito', label: 'Esito'},
    {id: 'idDocumentoOriginale', label: 'ID documento nel sistema di origine'},
    {id: 'idOrigine', label: 'ID documento nel sistema di origine'},
    {id: 'idFascicolo', label: 'ID fascicolo'},
    {id: 'idSistemaVersante', label: 'Identificazione del sistema versante'},
    {id: 'livelloRiservatezza', label: 'Livello di riservatezza'},
    {id: 'nomeSezionale', label: 'Nome del sezionale'},
    {id: 'note1', label: 'Note 1'},
    {id: 'note2', label: 'Note 2'},
    {id: 'ddt', label: 'Nr. DDT'},
    {id: 'notaAccredito', label: 'Nr. nota di accredito'},
    {id: 'progressivo', label: 'Nr. progressivo libro/registro'},
    {id: 'numeroFattura', label: 'Numero fattura'},
    {id: 'sezionale', label: 'Sezionale'},
    {id: 'soggettoImposta', label: 'Soggetto a imposta di bollo'},
    {id: 'tipoNotifica', label: 'Tipo notifica'},
    {id: 'tipologia', label: 'Tipologia documento'},

]

class FormFatture extends React.Component {

    constructor(...args) {
        super(...args)
        this.closingDateRe = /[\d\\\-\.\/]/
        this.closingDateMaxLen = 10
    }

    render() {
        const {fields, handleSubmit} = this.props;
        // const patchedClosingDate = {...closingDate, onKeyPress: ::this.handleClosingDateKeyPress}
        return (
            <form className="FormFatture">
                { this.renderSeparator("File") }
                { this.renderFileInfo() }
                { this.renderSeparator("Documento") }
                { this.renderBasic() }
                { this.renderSeparator("Soggetto Produttore") }
                { this.renderProducer() }
                { this.renderSeparator("Destinatario") }
                { this.renderConsumer() }
                { this.renderSeparator("Soggetto Tributario") }
                { this.renderTax() }
                { this.renderSeparator("Extra Info") }
                { this.renderExtra() }
          </form>
        );
    }

    handleClosingDateKeyPress(event) {
        // Blocks unwanted characters in date
        if (!this.closingDateRe.test(event.key)) {
            event.preventDefault()
        }
        if (event.target.value.length > 10) {
            event.preventDefault()
        }
    }

    renderFileInfo() {
        const { fields } = this.props;
        return (
            <div>
                <div className="FormFatture-Row">
                    <label className="FormFatture-Field">Nome del file</label>
                    <div>{fields.filename ? fields.filename.value : "-"}</div>
                </div>
                {
                // <div className="FormFatture-Row">
                //     <label className="FormFatture-Field">Hash</label>
                //     <div>{fields.hash ? fields.hash.value : "-"}</div>
                // </div>
                }
            </div>
        )
    }

    renderBasic() {
        return BASIC_FIELDS.map(::this.renderField)
    }

    renderProducer() {
        return PRODUCER_FIELDS.map(::this.renderField)
    }

    renderConsumer() {
        return CONSUMER_FIELDS.map(::this.renderField)
    }

    renderTax() {
        return TAX_FIELDS.map(::this.renderField)
    }

    renderExtra() {
        return EXTRA_FIELDS.map(::this.renderField)
    }

    renderSeparator(title) {
        return <div className="FormFatture-Separator">
            { title }
        </div>
    }

    renderField(field) {
        let f = this.props.fields[field.id]
        return (
            <div className="FormFatture-Row" key={field.id}>
                <label className={classNames(
                    'FormFatture-Field',
                    {'FormFatture-Field--error': f.error},
                    {'FormFatture-Field--mandatory': field.mandatory}
                ) }>{field.label}</label>
                <input type="text" {...f} placeholder={field.placeholder}/>
            </div>
        )
    }
}


export default reduxForm({
    form: 'fatture',
    fields: [].concat(
        FILE_FIELDS,
        BASIC_FIELDS,
        PRODUCER_FIELDS,
        CONSUMER_FIELDS,
        TAX_FIELDS,
        EXTRA_FIELDS
    ).map(f => f.id),
    validate: validateFatture
}, (state) => {
    return {
        initialValues: state.invoices.data[state.invoices.selected]
    }
})(FormFatture)