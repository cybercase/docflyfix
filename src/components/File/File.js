import React, { PropTypes } from 'react'
import classnames from 'classnames'

import fileStyle from './File.css'

import Dropzone from 'react-dropzone'
import ReactList from 'react-list'


class File extends React.Component {
    static propTypes = {
        files: PropTypes.arrayOf(PropTypes.shape({
            filename: PropTypes.string.isRequired
        })),
        onSelect: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onAdd: PropTypes.func.isRequired,
        onDownload: PropTypes.func.isRequired,
        onReset: PropTypes.func.isRequired,
        dragMessage: PropTypes.string.isRequired
    }

    render() {
        return (
            <Dropzone ref="dropzone" className="File" onDrop={::this.handleDropFile} disableClick={true}>
                <div className="File-Menu">
                    <div className="File-Menu-Add">
                        <button className="File-Menu-Add-Button" onClick={::this.handleAddFile} >Aggiungi</button>
                        {
                            // <div className="File-Menu-Add-Message">oppure trascina i file nella lista</div>
                        }
                    </div>
                    <div className="File-Menu-Download">
                        <button className="File-Menu-Download-Button" onClick={::this.handleDownload}>Download</button>
                    </div>
                    <div className="File-Menu-Reset">
                        <button className="File-Menu-Download-Button" onClick={::this.handleReset}>Reset Lista</button>
                    </div>
                </div>

                <div className="File-List">
                    {
                        this.props.files.length === 0 ?
                        <div className="File-Message">
                            <div>
                                <div className="File-Message-Title">{ this.props.dragMessage }</div>
                                <div className="File-Message-Subtitle">o clicca sul pulsante <strong>Aggiungi</strong></div>
                            </div>
                        </div>
                        : null
                    }
                    <div className={classnames(
                            "File-List-Container",
                            {"File-List-Container--scroll": this.props.files.length > 0}
                        )}>
                        <ReactList
                            ref="list"
                            itemRenderer={::this.renderFile}
                            length={this.props.files.length}
                            type='uniform'/>
                    </div>
                </div>
                
            </Dropzone>
        )
    }

    componentDidUpdate() {
        const {files, selected} = this.props
        if (selected >= files.length) {
            return
        }
        this.refs.list.scrollAround(selected)
    }

    renderFile(index, key) {
        const { selected, files, onRemove } = this.props
        const className = classnames('File-List-Item', {
                'File-List-Item--odd': index % 2 == 1,
                'File-List-Item--even': index % 2 == 0,
                'File-List-Item--selected': index == selected,
                'File-List-Item--invalid': Object.keys(files[index].error || {}).length !== 0
        })
        return (
            <div className={className}
                 key={key}
                 onMouseDown={this.handleFileSelection.bind(this, index)}>
                <div className="File-List-Item-Name" >
                    <span>{ files[index].filename }</span>
                </div>
                <div className="File-List-Item-Remove">
                    <span onMouseDown={e => e.stopPropagation()} onClick={onRemove.bind(this, index)}>
                        <i className="fa fa-times"></i>Rimuovi
                    </span>
                </div>
            </div>
        )
    }

    handleFileSelection(index) {
        this.props.onSelect(index)
    }

    handleDropFile(files, event) {
        let select = files.length === 1
        files.forEach((f) => { this.props.onAdd(f, select) })
    }

    handleAddFile() {
      this.refs.dropzone.open()
    }

    handleDownload() {
        const { files } = this.props;
        let error = false;

        let invalidFileIndex = -1;
        files.forEach((f, i) => {
            if (invalidFileIndex === -1 && Object.keys(f.error).length > 0) {
                invalidFileIndex = i
                error = true
            }
        })

        if (invalidFileIndex >= 0) {
            this.props.onSelect(invalidFileIndex)
        }

        this.props.onDownload(error);
    }

    handleReset() {
        this.props.onReset();
    }
}

export default File;