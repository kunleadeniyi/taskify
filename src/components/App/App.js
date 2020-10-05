import React from 'react';
// import logo from '../../logo.svg';
import { Route } from "react-router-dom";
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Login from '../Landing/Login';
import Signup from '../Landing/Signup';
import Home from '../Home/Home';
import Middle from '../Middle/Middle';
import Landing from '../Landing/Landing';

function App() {
  return (
    <div className="App">
      <Route exact path='/'><Landing /></Route>
      <Route exact path='/home'><Home /></Route>
      <Route path='/home/:id'>
        <Home>
          <Middle />
        </Home>
      </Route>
      <Route exact path='/login'><Login /></Route>
      <Route exact path='/signup'><Signup /></Route>
    </div>
  );
}

export default App;

