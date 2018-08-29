import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import '../../css/FrontLayout.css';
import { Container, Row, Col, Nav,NavItem} from 'reactstrap';
import {Link} from 'react-router-dom';

export default class FrontLayout extends Component {
    render() {

        axios.interceptors.request.use((request) => {
            if (request.data && request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                request.data = qs.stringify(request.data);
            }
            return request;
        });

        return (
            <div>
                <Nav className="front-nav">
                    <NavItem className="menu-item">
                        <Link to={'#'} >React app</Link>
                    </NavItem>
                    <NavItem className="menu-item">
                        <Link to={"/login"} >Login</Link>
                    </NavItem>
                    <NavItem className="menu-item">
                        <Link to={"/register"}>Register</Link>
                    </NavItem>
                    <NavItem className="menu-item">
                        <Link to={"/forgot-password"}>Forgot password</Link>
                    </NavItem>
                </Nav>
                <Container className={'front-container'}>
                    <div className={'content'}>
                        <Row className='box-row'>
                            <Col sm="12" md={{ size: 5, offset: 3 }} id="box">
                                {this.props.children}
                            </Col>
                        </Row>
                    </div>
                </Container>

            </div>
        );
    }
}