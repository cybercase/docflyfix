import IndexHTML from 'file?name=[name].[ext]!./index.html';
import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import normalizeStyle from 'normalize.css'
import fontAwesomeStyle from "font-awesome/css/font-awesome.css"
import mainStyle from './main.css'



render(
  <Root />,
  document.getElementById('Main')
)