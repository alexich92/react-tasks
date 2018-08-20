import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Users from './components/Users/Users';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';

export default class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route exact path="/users" component={Users}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/forgot-password" component={ForgotPassword}/>
                </Switch>
            </BrowserRouter>
        );
    }
}
