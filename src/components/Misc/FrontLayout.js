import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import '../../css/FrontLayout.css';
import { Container, Row, Col, Nav, NavLink,NavItem} from 'reactstrap';

export default class FrontLayout extends Component {
    render() {

        axios.interceptors.request.use((request) => {
            if (request.data && request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                request.data = qs.stringify(request.data);
            }
            return request;
        });

        return (

            <Container className={'front-container'}>
                <Nav className="front-nav">
                    <NavItem>
                        <NavLink href="#">React app</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/login">Login</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/register">Register</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/forgot-password">Forgot Password</NavLink>
                    </NavItem>
                </Nav>
                <div className={'content'}>
                    <Row className='box-row'>
                        <Col sm="12" md={{ size: 5, offset: 3 }} id="box">
                            {this.props.children}
                        </Col>
                    </Row>
                </div>
            </Container>
        );
    }
}