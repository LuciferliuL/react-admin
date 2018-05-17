import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from './Component/Login/Login';
import Home from './Component/Home/Home';


ReactDOM.render(
    <BrowserRouter basename='/'>
        <Switch>    
            <Route path="/Home" component={Home}></Route>{/*主页面*/}
            <Route exact  path='/' component={Login}></Route>{/*登入页面*/}
        </Switch>
    </BrowserRouter>
    , document.getElementById('root'));
registerServiceWorker();
