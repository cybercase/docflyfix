import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import appStyle from './App.css'

export default connect()((props) => { 
    const { dispatch, children } = props

    const hiearchy = props.routes.filter(route => route.path);
    
    const leaf = hiearchy[hiearchy.length - 1]
    const parents = hiearchy.slice(0, hiearchy.length - 1)

    return (
        <div className="App">
            <div className="App-Title">
                {
                    parents.map((route) => {
                        return (
                            <div className="App-Title-Link App-Title-Link--parent" key={route.name}>
                                <Link to={route.path}>
                                    { route.name }
                                </Link>
                            </div>
                        )
                    })
                }
                <div className="App-Title-Link App-Title-Link--leaf" key={ leaf.name }>
                    <div>
                        { leaf.name }
                    </div>
                    {
                        hiearchy.length === 1 ?
                            <div className="App-Title-Link App-Title-Link--motto">
                                Un'app <a target="_blank" href="https://it.wikipedia.org/wiki/Usabilità"><strong>usabile</strong></a> che <strong>funziona bene</strong> per generare i tuoi IPDV... per i clienti di <a target="_blank" href="https://www.docfly.it/"><strong>Aruba DocFly Conservazione Digitale</strong></a>
                            </div>
                            : null
                    }
                </div>
            </div>
            <div className="App-Content">
                { children }
            </div>
        </div>
    )
})

