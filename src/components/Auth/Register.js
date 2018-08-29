import React, {Component} from 'react';
import FrontLayout from '../Misc/FrontLayout';
import axios from 'axios';
import {Button, FormGroup, Form, Label, Input} from 'reactstrap';
import { Link } from 'react-router-dom'

export default class Register extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        errorMessage:'',
    };


    _onChange = (e) => {
        const {name, value} = e.target;

        this.setState({
            [name]: value
        });
    };

    _register = async () => {
        const {name,email, password} = this.state;

        const res = await axios.post(process.env.REACT_APP_API_URL + 'register', {
           name, email, password
        });

        if (res && res.data && res.data.responseType === 'success') {
            this.props.history.push('/login');
        } else {
            this.setState({
                errorMessage: res.data.errorMessage
            })
        }
    };


    render() {
        const {name, email, password, errorMessage} = this.state;
        return (
            <FrontLayout>
                <h2 className="text-center">Register</h2>
                <Form>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text"
                               name="name"
                               id="name"
                               placeholder="Name"
                               value={name}
                               onChange={this._onChange} required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input type="email"
                               name="email"
                               id="email"
                               placeholder="Email"
                               value={email}
                               onChange={this._onChange}
                               required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input type="password"
                               name="password"
                               id="password"
                               placeholder="Password"
                               value={password}
                               onChange={this._onChange}
                               required/>
                    </FormGroup>

                    {errorMessage !=='' &&  <p className="errors">{errorMessage}</p>}
                    <Button color="primary" onClick={this._register}>Register</Button>
                    <Link to={'login'} style={{float:'right',marginTop:'6px'}}>Already member?Go to login page.</Link>

                </Form>

            </FrontLayout>
        )
    }
}
