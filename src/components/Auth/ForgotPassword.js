import React, {Component} from 'react';
import FrontLayout from '../Misc/FrontLayout';
import axios from 'axios';
import {Button, FormGroup, Form, Label, Input} from 'reactstrap';

export default class ForgotPassword extends Component {
    state = {
        email:'',
        password:'',
        resetPassword:false,
        code: '',
        errorMessage:'',
        shouldRerender:false
    };


    _onChange = (e) => {
        const {name, value} = e.target;

        this.setState({
            [name]: value
        });
    };

    _toggle = () => {
        this.setState({
            resetPassword: !this.state.resetPassword,
            email:'',
            password:'',
            code:'',
            errorMessage:''
        });
    };


    _sendResetCode =  async() =>{
        const {email} = this.state;

        const res = await axios.post(process.env.REACT_APP_API_URL + 'forgot-password', {email});

        if (res && res.data && res.data.responseType === 'success') {
            this.setState({
                email:'',
                errorMessage:'',
                resetPassword:true
            });
        } else {
            this.setState({
                errorMessage: res.data.errorMessage
            })
        }

    }

    _resetPassword =  async() =>{
        const {email,code,password} = this.state;

        const res = await axios.post(process.env.REACT_APP_API_URL + 'change-password', {email,code,password});

        if (res && res.data && res.data.responseType === 'success') {
            this.props.history.push('/login');
        } else {
            this.setState({
                errorMessage: res.data.errorMessage
            })
        }

    }

    render() {
        const {email,code,password,resetPassword,errorMessage} = this.state;
        return (
            <FrontLayout>
                <h2 className="text-center">{resetPassword ? 'Reset password' :'Forgot password'}</h2>
                <Form>
                    <FormGroup>
                        <Label for="name">Email</Label>
                        <Input type="email"
                               name="email"
                               id="email"
                               placeholder="Email"
                               value={email}
                               onChange={this._onChange}/>
                    </FormGroup>
                    {resetPassword && <FormGroup>
                        <Label for="name">Code</Label>
                        <Input type="text"
                               name="code"
                               id="code"
                               placeholder="Code"
                               value={code}
                               onChange={this._onChange}/>
                    </FormGroup> }
                    {resetPassword && <FormGroup>
                        <Label for="name">New Password</Label>
                        <Input type="password"
                               name="password"
                               id="password"
                               placeholder="New password"
                               value={password}
                               onChange={this._onChange}/>
                    </FormGroup> }

                    {errorMessage !=='' && <p className='errors'>{errorMessage}</p>}
                    <Button color="primary"
                            onClick={resetPassword ? this._resetPassword : this._sendResetCode}>
                            {resetPassword ? 'Reset password' : 'Send reset code' }
                    </Button>
                    <p style={{float:'right',marginTop:'6px',cursor:'pointer' ,color:'#007bff'}}
                       onClick={this._toggle}
                    >{resetPassword ?'Resend code' : 'Already have a code?'}
                    </p>
                </Form>
            </FrontLayout>
        )
    }
}
