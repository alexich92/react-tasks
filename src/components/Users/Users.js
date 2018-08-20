import React, {Component} from 'react';
import axios from 'axios';
import UserRow from "./UserRow";
import Layout from '../Misc/Layout';
import '../../css/Users.css';

import {ModalFooter, Button, Modal, ModalHeader, ModalBody, FormGroup, Form, Label, Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

export default class Users extends Component {
    state = {
        users: [],
        open: false,
        deleteAction:false,
        id: false,
        name: '',
        email: '',
        password: '',
        role: '',
        shouldRerender: false,
        currentPage:'',
        lastPage:'',
        errors:[]
    };

    async componentDidMount() {
        let users = await axios.get(process.env.REACT_APP_API_URL + `admin/users`);
        this.setState({
            users: users.data.data.data,
            currentPage: users.data.data.current_page,
            lastPage:users.data.data.last_page
        });
    }

    async componentDidUpdate() {
        if (this.state.shouldRerender) {
            let {currentPage} = this.state;
            let users = await axios.get(process.env.REACT_APP_API_URL + `admin/users?page=${currentPage}`);
            this.setState({
                users: users.data.data.data,
                shouldRerender: false,
                errors:[]
            });
        }
    }



    _loadNextUsers = async (number)  =>{
        let nextUsers = await axios.get(process.env.REACT_APP_API_URL + `admin/users?page=${number}`);
        this.setState({
            users: nextUsers.data.data.data,
            currentPage: nextUsers.data.data.current_page
        });
    }


    _toggle = () => {
        this.setState({
            open: !this.state.open
        });
    };

    _onChange = (e) => {
        const {name, value} = e.target;
        this.setState({
            [name]: value
        });
    };

    _deleteUser = async (user_id)  =>{
        let res =  await axios.delete(process.env.REACT_APP_API_URL + `admin/user/${user_id}`);
        if (res && res.data && res.data.responseType === 'success') {
            this.setState({
                shouldRerender: true,
                open: false,
                deleteAction:false,
            });
        }
    }

    _userAction = async () => {
        const {name, email, password, role, id} = this.state;

        const data = {
            name, email
        };

        if (role !== '') {
            data.role = role;
        }

        let res;

        if (id) {
            res = await axios.patch(process.env.REACT_APP_API_URL + `admin/user/${id}`, data);
        } else {
            data.password = password;
            res = await axios.post(process.env.REACT_APP_API_URL + 'admin/user', data);
        }

        if (res && res.data && res.data.responseType === 'success') {
            this.setState({
                shouldRerender: true,
                open: false,
            });
        }else{
            this.setState({
                errors: res.data.errorMessage
            })
        }
    };

    _add = () => {
        this.setState({
            id: false,
            name: '',
            password:'',
            email: '',
            role: '',
            open: true,
            deleteAction:false,
            errors:[],
        });
    };

    _delete = (user) =>{
        this.setState({
            id:user.id,
            open:true,
            deleteAction:true,
            errors:[],
        })
    }

    _edit = (user) => {
        this.setState({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role_id,
            open: true,
            errors:[],
            deleteAction:false,
        });
    };

    render() {
        const {users, id,lastPage,deleteAction} = this.state;

        const paginationNumbers = [];
        for (let i = 1; i <=lastPage; i++) {
            paginationNumbers.push(i);
        }

        const DisplayPageNumbers = paginationNumbers.map(number => {
            return (
                <PaginationItem key={number}>
                    <PaginationLink id={number} onClick={() => this._loadNextUsers(number)}>{number}</PaginationLink>
                </PaginationItem>
            );
        });

        return (
            <Layout>
                <h1 className="text-center">Users lists</h1>
                <Button color="primary" onClick={this._add}>Add user</Button>
                <hr/>
                <Modal isOpen={this.state.open} toggle={this._toggle}>
                    <ModalHeader style={{textAlign:'center'}} toggle={this._toggle}>{deleteAction ? 'Delete user' :id ? 'Edit user' : 'Add user'}</ModalHeader>
                    <ModalBody>
                        {!deleteAction &&<Form>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input type="text"
                                       name="name"
                                       id="name"
                                       placeholder="Name"
                                       value={this.state.name}
                                       onChange={this._onChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input type="email"
                                       name="email"
                                       id="email"
                                       placeholder="Email"
                                       value={this.state.email}
                                       onChange={this._onChange}
                                       required/>
                            </FormGroup>
                            {!id && <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password"
                                       name="password"
                                       id="password"
                                       placeholder="Password"
                                       value={this.state.password}
                                       onChange={this._onChange}/>
                            </FormGroup>}

                            <FormGroup>
                                <Label for="role">Select</Label>
                                <Input type="select"
                                       name="role"
                                       id="role"
                                       onChange={this._onChange}
                                       value={this.state.role}>
                                    <option value={''}>Select</option>
                                    <option value={1}>Admin</option>
                                    <option value={2}>User</option>
                                </Input>
                            </FormGroup>
                        </Form> }

                        {deleteAction && <h4>Are you sure you want to delete this user?</h4>}

                        <p style={{color:'red'}}>{this.state.errors}</p>
                    </ModalBody>
                    <ModalFooter>
                        {!deleteAction && <Button color="primary" onClick={this._userAction}>{id ? 'Edit user' : 'Add user'}</Button> }
                        {deleteAction && <Button color="danger" onClick={() => this._deleteUser(id)}>Delete</Button> }
                        <Button color="secondary" onClick={this._toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <div className={'users-list'}>
                    {users && users.map((user, key) => {
                        return <UserRow key={key} user={user} edit={this._edit} deleted={this._delete}/>
                    })}
                    <Pagination className="user-pagination">
                        <PaginationItem>
                            <PaginationLink previous href="#" />
                        </PaginationItem>
                            {DisplayPageNumbers }
                        <PaginationItem>
                            <PaginationLink next href="#" />
                        </PaginationItem>
                    </Pagination>
                </div>
            </Layout>
        )
    }
}
