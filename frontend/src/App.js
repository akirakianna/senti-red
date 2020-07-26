import React from 'react'
import { Switch, Route, HashRouter } from 'react-router-dom'

import Welcome from './components/Welcome'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import Account from './components/Account'

import NavBar from './components/NavBar'
import { UserProvider } from './components/UserContext'
import { ApiProvider } from './components/ApiContext'

const App = () => {
  return <HashRouter>
    <UserProvider>
      <ApiProvider>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/account" component={Account} />
          {/* <Route exact path="/" component={Welcome} /> */}
        </Switch>
      </ApiProvider>
    </UserProvider>
  </HashRouter>
}

export default App

