import './scss/login.scss'
import React, {Component} from "react"
import {
  BrowserRouter as Router,
  Route,
  Switch, 
  Link, 
  Redirect
} from "react-router-dom"


import LoginPage from "./pages/login"
import MainPage from "./pages/index";
import NotFoundPage from "./pages/404.js"

class App extends Component {
  render() { 
    return( 
    <Router>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/login" component={LoginPage} />
        <Route component={NotFoundPage} /> 
      </Switch>
    </Router>
  )};
}

export default App;
