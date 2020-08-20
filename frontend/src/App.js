import React from 'react'
import { Switch, Route, HashRouter } from 'react-router-dom'

import Welcome from './components/Welcome'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import Account from './components/Account'
import ErrorBoundary from './components/ErrorBoundary'
import NavBar from './components/NavBar'
import { UserProvider } from './components/UserContext'
import Post from './components/Post'
import GlobalStyle from './components/GlobalStyle'
import { StyleProvider } from './components/StyleContext'
import { MaterialProvider } from './components/MaterialContext'
import { FormMaterialProvider } from './components/FormContext'

const App = () => (
  <HashRouter>
    <UserProvider>
      <StyleProvider>
        <GlobalStyle />
        <ErrorBoundary>
          <NavBar />
          <Switch>
            <Route exact path="/" component={Welcome} />
            <FormMaterialProvider>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <MaterialProvider>
                <Route exact path="/home" component={Home} />
                <Route exact path="/account" component={Account} />
                <Route path="/posts/:redditId" component={Post} />
              </MaterialProvider>
            </FormMaterialProvider>
          </Switch>
        </ErrorBoundary>
      </StyleProvider>
    </UserProvider>
  </HashRouter>
)


export default App

