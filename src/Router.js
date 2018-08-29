import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Home from './components/Home/Home';
import Users from './components/Users/Users';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import Tasks from "./components/Tasks";
import {LoggedUser} from "./components/Misc/LoggedUser";
import Task from "./components/Tasks/Task";
import Logout from './components/Auth/Logout';

export default class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={LoggedUser(Home)}/>
                    <Route exact path="/users" component={LoggedUser(Users)}/>
                    <Route exact path="/tasks" component={LoggedUser(Tasks)}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/logout" component={Logout}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/forgot-password" component={ForgotPassword}/>
                    <Route exact path="/task/:id" component={LoggedUser(Task)}/>
                </Switch>
            </BrowserRouter>
        );
    }
}
