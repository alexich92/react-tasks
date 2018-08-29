import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {NavLink,NavItem,Nav} from 'reactstrap';
import '../../css/Header.css';

export default class Header extends Component {

    render() {
        const {user} = this.props;
        return (
            <div className={'header'}>
                <Nav className="back-nav">
                    <NavItem>
                        <NavLink href="#">React app</NavLink>
                    </NavItem>
                    {user && user.role_id === 1 &&
                    <NavItem>
                        <Link className="nav-link" to={"/users"}>Users</Link>
                    </NavItem>}
                    <NavItem>
                        <Link className="nav-link" to={"/tasks"}>Tasks</Link>
                    </NavItem>
                    <NavItem  className="ml-auto" style={{marginRight:'15px'}}>
                        <Link to={"/logout"} className='btn btn-primary' id="logout">Logout</Link>
                    </NavItem>
                </Nav>
            </div>
        );
    }
}