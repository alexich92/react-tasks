import React, {Component} from 'react';
import FrontLayout from '../Misc/FrontLayout';
import axios from 'axios';
import {Button, FormGroup, Form, Label, Input} from 'reactstrap';

export default class Login extends Component {
    state = {
        email: '',
        password: '',
        errors:''
    };

    _onChange = (e) => {
        const {name, value} = e.target;

        this.setState({
            [name]: value
        });
    };

    _login = async () => {
        const {email, password} = this.state;

        const response = await axios.post(process.env.REACT_APP_API_URL + 'login', {
            email, password
        });

        if (response && response.data && response.data.data) {
            sessionStorage.setItem('token', response.data.data.jwt);
            this.props.history.push('/users');
        } else {
            this.setState({
                errors: response.data.errorMessage
            });

        }
    };

    render() {
        const {email, password} = this.state;

        return (
            <FrontLayout>
                <h2 className="text-center">Login</h2>
                <Form>
                    <FormGroup>
                        <Label for="name">Email</Label>
                        <Input type="text"
                               name="email"
                               id="email"
                               placeholder="Email"
                               value={email}
                               onChange={this._onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="name">Password</Label>
                        <Input type="password"
                               name="password"
                               id="password"
                               placeholder="Password"
                               value={password}
                               onChange={this._onChange}/>
                    </FormGroup>
                    <p className="errors">{this.state.errors}</p>
                    <Button onClick={this._login}>Login</Button>
                    <a href="/forgot-password" style={{float:'right',marginTop:'6px'}}>Forgot your password?</a>
                </Form>

            </FrontLayout>
        )
    }
}
