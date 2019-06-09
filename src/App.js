import React from 'react'
import {Router, Route, Switch} from 'react-router-dom'
import {history} from './history'
import Privacy from './bitmex/component'

const App = () => {
  return (
    <Router history={history}>
        <Switch>
          <Route path='/privacy' component={Privacy}/>
        </Switch>
    </Router>
  )
}
export default App