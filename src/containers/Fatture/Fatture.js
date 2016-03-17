import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import Modal from 'react-modal'  // Seems quite unmaintained... feel free to replace if needed
import Moment from 'moment'

import { RFC3339Nano } from 'utils'
import File from 'components/File/File'
import FormFatture from 'components/FormFatture/FormFatture'
import * as Actions from 'actions'

import { DATE_FORMATS } from 'utils'
import ipdvTpl from 'templates/ipdv.handlebars'

import fattureStyle from 'style/Fatture+Notifiche.css'


class Fatture extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    }

    constructor(...args) {
        super(...args)

        this.state = {
            modal: false,
            error: false,
            dismissTimeout: null,
            ipdv: ""
        }
    }

    render() {
        const { dispatch, invoices: { selected, data } } = this.props
        const { modal, error, ipdv } = this.state
        return (
            <div className="Fatture">   
                <Modal isOpen={modal} style={modalStyle} onRequestClose={ ::this.handleCloseModal }>
                    <form className="Fatture-Modal" onSubmit={ ::this.handleSubmit }>
                        <div className="Fatture-Modal-Title">
                            Inserisci l'ID del PdV
                        </div>
                        <div className="Fatture-Modal-Subtitle">
                            (es: Fatture Novembre 2015)
                        </div>
                        <div className="Fatture-Modal-Id">
                            <input type="text" value={ipdv} onChange={::this.handleIpdvInput} ref={input => input && input.focus()}/>
                        </div>
                        <div className="Fatture-Modal-Submit">
                            <input type="submit" value="Download" disabled={ipdv.length == 0}/>
                        </div>
                    </form>
                </Modal>

                <Modal isOpen={error} style={errorStyle} onRequestClose={ ::this.handleDismissError }>
                    { this.getErrorMessage() }
                </Modal>

                <div className="Fatture-File">
                    <File files={ data }
                          selected={ selected }
                          onSelect={ ::this.handleFileSelection }
                          onAdd={ ::this.handleFileAdd }
                          onRemove={ ::this.handleFileRemove }
                          onDownload={ ::this.handleOpenModal }
                          dragMessage= { "Trascina qui le Fatture" } />
                </div>
                <div className="Fatture-Form">
                    {
                        data[selected] ? 
                            <FormFatture/>
                            : (
                                data.length > 0 ?
                                 <div className="Fatture-Message">
                                    <div>Seleziona un File</div>
                                </div>
                                : null
                            )
                    }
                </div>
            </div>
        )
    }

    handleFileRemove(index, file, item, event) {
        event.preventDefault()
        event.stopPropagation()
        this.props.dispatch(Actions.removeInvoice({index, file}))
    }

    handleFileAdd(file, select) {
        this.props.dispatch(Actions.addInvoice({file, select}))
    }

    handleFileSelection(index, file, select) {
        this.props.dispatch(Actions.selectInvoice({index}))
    }

    handleCloseModal() {
        this.setState({modal: false})
    }

    handleOpenModal(error) {
        error = error || this.props.invoices.data.length === 0

        let dismissTimeout = null;
        if (error) {
            dismissTimeout = setTimeout(() => this.setState({error: false, dismissTimeout: null}), 3000)
        }

        this.setState({
            modal: !error,
            error,
            dismissTimeout
        })
    }

    handleDismissError() {
        if (this.state.dismissTimeout) {
            clearTimeout(this.state.dismissTimeout)
        }

        this.setState({
            error: false,
            dismissTimeout: null
        })
    }

    handleIpdvInput(e) {
        this.setState({ipdv: e.target.value})
    }

    handleSubmit(e) {
        e.stopPropagation()
        e.preventDefault()
        
        let result = ipdvTpl({
            iddoc: this.state.ipdv,
            docClass: '3237__Fattura_PA',
            fatture: this.props.invoices.data.map((fattura) => {
                return {
                    ...fattura,
                    dataDocumento: fattura.dataDocumento ? Moment(fattura.dataDocumento, DATE_FORMATS).utc().format(RFC3339Nano) : '',
                    dataDocumentoTributario: fattura.dataDocumentoTributario ? Moment(fattura.dataDocumentoTributario, DATE_FORMATS).utc().format(RFC3339Nano) : ''
                }
            })
        })

        let a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
        a.setAttribute('download', 'IPDV_' + this.state.ipdv + '.xml');
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    getErrorMessage() {
        // LAME
        if (this.props.invoices.data.length === 0)
        {
            return <div className="Fatture-Error">
                <i className="fa fa-exclamation-circle"></i> Aggiungi almeno un file
            </div>
        }
        else
        {
            return <div className="Fatture-Error">
                <i className="fa fa-exclamation-circle"></i> Completa i campi in <span style={{color: 'red', fontWeight: '800'}}>rosso</span>
            </div>
        }
    }
}


// Found out that react-modal uses inline styles :(
const errorStyle = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
}
const modalStyle = errorStyle

export default connect( (state) => { return {invoices: state.invoices}; } )(Fatture)