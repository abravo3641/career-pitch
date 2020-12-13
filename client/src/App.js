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
import HomeFeed from "./pages/home-applicant"
import HomeFeedRecruiter from "./pages/home-recruiter"

//Firebase Set up
import withFirebaseAuth from 'react-with-firebase-auth' ;
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './pages/firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

class App extends Component {

  constructor() {
    super();
    this.state = {
      me: firebase.auth().currentUser
    }
  }

  render() { 
    return( 
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/feed" component={HomeFeed} /> 
        <Route path="/feedRecruiter" component={HomeFeedRecruiter}/>
        <Route component={NotFoundPage} />
        
      </Switch>
    </Router>
  )};
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
