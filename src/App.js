import React from 'react'
import {Router, Route, Switch} from 'react-router-dom'
import {history} from './history'
import component from './bitmex/component'

const App = () => {
  return (
    <Router history={history}>
        <Switch>
          <Route path='/test' component={component}/>
        </Switch>
    </Router>
  )
}
export default App