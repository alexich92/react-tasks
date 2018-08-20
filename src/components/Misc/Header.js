import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Button,NavLink,NavItem,Nav} from 'reactstrap';
import '../../css/Header.css';

export default class Header extends Component {


    state = {
        redirect: false
    };

    _logout = () => {
        sessionStorage.removeItem('token');

        this.setState({
            redirect: true
        });
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/login'}/>;
        }

        return (
            <div className={'header'}>
                <Nav className='back-nav'>
                    <NavItem>
                        <NavLink href="#">React app</NavLink>
                    </NavItem>
                    <NavItem >
                        <NavLink  href="/users">Users</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="">Wip-Tasks</NavLink>
                    </NavItem>
                </Nav>
                <Button color="primary" size="sm" id="logoutButton" className="float-right" onClick={this._logout}>Logout</Button>

            </div>
        );
    }
}