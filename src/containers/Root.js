import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { routeActions } from 'react-router-redux'
import { Provider, connect } from 'react-redux'
import configureStore from 'configureStore'

import Fatture from 'containers/Fatture'
import Notifiche from 'containers/Notifiche'
import Home from 'containers/Home'
import App from 'containers/App'

const store = configureStore()


export default class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path="/" component={App} name="DocFlyFix">
            <IndexRoute component={Home}/>
            <Route path="fatture" component={Fatture} name="Fatture"/>
            <Route path="notifiche" component={Notifiche} name="Notifiche"/>
          </Route>
        </Router>
      </Provider>
    )
  }
}