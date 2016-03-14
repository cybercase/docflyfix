import React from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import marked from 'marked'

// import introMd from 'intro/intro.md'
// import introImage1 from 'intro/image1.gif'
// import introImage2 from 'intro/image2.gif'
// import introImage3 from 'intro/image3.gif'
// import introImage4 from 'intro/image4.gif'

import homeStyle from './Home.css'

function intro() {
    let imd = introMd;
    imd = imd.replace(/image1/, introImage1)
    imd = imd.replace(/image2/, introImage2)
    imd = imd.replace(/image3/, introImage3)
    imd = imd.replace(/image4/, introImage4)
    return {
        __html: marked(imd, {
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        })
    }
}

export default connect()((props) => {
  const { dispatch } = props;
  return (
    <div className="Home">
        <div className="Home-Start">
            {
                // <div className="Home-Start-Title">
                //     <div>Sei un cliente di</div>
                //     <div>Aruba DocFly - Conservazione Digitale ?</div>
                // </div>
                // <div className="Home-Start-Subtitle">
                //     Crea un indice (IPDV) per:
                // </div>
            }
            {
            // <a href="#" onClick={(e) => { dispatch(routeActions.push('/fatture')); e.preventDefault();} }>
            //     Fatture
            // </a>
            // <a href="#" onClick={(e) => { dispatch(routeActions.push('/notifiche')); e.preventDefault();} }>
            //     Notifiche
            // </a>
            }
            <h1>Scegli il tipo di documento</h1>
            <ul className="Home-Start-Menu">
                <li><button type="button" onClick={() => dispatch(routeActions.push('/fatture'))} > Fatture </button></li>
                <li><button type="button" onClick={() => dispatch(routeActions.push('/notifiche')) } > Notifiche </button></li>
            </ul>
        </div>

        <div className="Home-Guide">
            <a href="https://github.com/cybercase/docflyfix">
                <img style={{position: 'absolute', top: 0, right: 0, border: 0, maxHeight: 130}} src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"></img>
            </a>
            {
                // <div className="Home-Guide-Content" dangerouslySetInnerHTML={intro()}></div>
            }
        </div>
    </div>
  )
})
