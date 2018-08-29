import React, {Component} from 'react';
import Layout from "../Misc/Layout";
import axios from "axios";
import {Link} from "react-router-dom";
import {ModalFooter, Button, Modal, ModalHeader, ModalBody, FormGroup, Form, Label, Input, Col, Row,Pagination, PaginationItem, PaginationLink} from 'reactstrap';

import '../../css/Tasks.css';


export default class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            users: [],
            shouldRerender: false,
            name: '',
            description: '',
            assign: '',
            status:'',
            open: false,
            id: false,
            currentPage:'',
            lastPage:'',
            deleteAction:false

        }
    }

    async componentDidMount() {
        let response = await axios.get(process.env.REACT_APP_API_URL + `tasks`);
        let usersResponse = await axios.get(process.env.REACT_APP_API_URL + `users`);
        this.setState({
            tasks: response.data.data,
            users: usersResponse.data.data.data,
            currentPage: response.data.data.current_page,
            lastPage:response.data.data.last_page
        });
    }


    _loadNextTasks = async (number)  =>{
        let nextTasks = await axios.get(process.env.REACT_APP_API_URL + `tasks?page=${number}`);
        this.setState({
            tasks: nextTasks.data.data,
            currentPage: nextTasks.data.data.current_page
        });
    }


    _showStatus = status => {
        switch (status) {
            case 0:
                return  "Assigned";
            case 1:
                return 'In progress';
            case 2:
                return 'Not done';
            case 3:
                return 'Done';
            default:
                return 'Unknown';
        }
    };

    async componentDidUpdate() {
        if (this.state.shouldRerender) {
            let{currentPage}  = this.state;
            let response = await axios.get(process.env.REACT_APP_API_URL + `tasks?page=${currentPage}`);

            this.setState({
                tasks: response.data.data,
                shouldRerender: false,
            });
        }
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

    _add = () => {
        this.setState({
            id: false,
            name: '',
            description: '',
            assign: '',
            open: true,
            deleteAction:false
        });
    };

    _edit = (task) => {
        this.setState({
            id: task.id,
            name: task.name,
            description: task.description,
            assign: task.assign,
            status:task.status,
            open: true,
            deleteAction:false
        });
    };

    _delete = (task) => {
        this.setState({
            id: task.id,
            open: true,
            deleteAction:true,
        });
    };

    _addTask = async () => {
        const {name, description, assign} = this.state;

        let res = await axios.post(process.env.REACT_APP_API_URL + 'task', {name, description, assign});

        if (res && res.data && res.data.responseType === 'success') {
            this.setState({
                shouldRerender: true,
                open: false
            });
        }
    };

    _editTask = async () => {
        const {id, name, description, assign,status} = this.state;

        let res = await axios.patch(process.env.REACT_APP_API_URL + `task/${id}`, {name, description, assign,status});

        if (res && res.data && res.data.responseType === 'success') {
            this.setState({
                shouldRerender: true,
                open: false
            });
        }
    };

    _deleteTask = async id => {
        let res = await axios.delete(process.env.REACT_APP_API_URL + `task/${id}`);

        if (res && res.data && res.data.responseType === 'success') {
            this.setState({
                shouldRerender: true,
                open: false
            });
        }
    };

    _showUser = user_id => {
        const {users} = this.state;
        let name = '';

        users && users.map(user => {
            if (user.id === user_id) {
                name = user.name;
            }
        });

        return name;
    };

    render() {

        const {tasks, users, name, description, assign, open, id,deleteAction,lastPage} = this.state;
        const {user} = this.props;

        const paginationNumbers = [];
        for (let i = 1; i <=lastPage; i++) {
            paginationNumbers.push(i);
        }

        const DisplayPageNumbers = paginationNumbers.map(number => {
            return (
                <PaginationItem key={number}>
                    <PaginationLink id={number} onClick={() => this._loadNextTasks(number)}>{number}</PaginationLink>
                </PaginationItem>
            );
        });



        return (
            <Layout user={user}>
                <Modal isOpen={open} toggle={this._toggle}>
                    <ModalHeader toggle={this._toggle}>{id ? 'Edit task' : 'Add task'}</ModalHeader>
                    <ModalBody>
                        {!deleteAction && <Form>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input type="text"
                                       name="name"
                                       id="name"
                                       placeholder="Name"
                                       value={name}
                                       onChange={this._onChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input type="textarea"
                                       name="description"
                                       id="description"
                                       placeholder="Description"
                                       value={description}
                                       onChange={this._onChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="assign">Assign to</Label>
                                <Input type="select"
                                       name="assign"
                                       id="assign"
                                       onChange={this._onChange}
                                       value={assign}>
                                    <option value={''}>Select</option>
                                    {users && users.map((user, key) => {
                                        return <option key={key} value={user.id}>{user.name}</option>;
                                    })}
                                </Input>
                            </FormGroup>
                            {id && <FormGroup>
                                <Label for="role">Status</Label>
                                <Input type="select"
                                       name="status"
                                       id="status"
                                       onChange={this._onChange}
                                       value={this.state.status}>
                                    <option value={''}>Select</option>
                                    <option value={0}>Assigned</option>
                                    <option value={1}>In progress</option>
                                    <option value={2}>Not done</option>
                                    <option value={3}>Done</option>
                                </Input>
                            </FormGroup>}
                        </Form>}
                        {deleteAction && <h3>Are you sure you want to delete this task?</h3>}
                    </ModalBody>
                    <ModalFooter>
                        {!deleteAction && <Button color="primary"
                                onClick={id ? this._editTask : this._addTask}>{id ? 'Edit task' : 'Add task'}</Button>}
                        {deleteAction && <Button color="danger"
                                                 onClick={()=>this._deleteTask(id)}>Delete</Button>}
                        <Button color="secondary" onClick={this._toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <h2 className="text-center">Task list</h2>
                <Button className={'add-new'} color="primary" onClick={this._add}>Add task</Button>
                <hr/>
                <div className={'tasks-list'}>
                    <Row className={'table-header'}>
                        <Col xs={1}>Id</Col>
                        <Col xs={2}>Name</Col>
                        <Col xs={2}>Description</Col>
                        <Col xs={1}>Created by</Col>
                        <Col xs={2}>Assigned to</Col>
                        <Col xs={1}>Status</Col>
                        <Col xs={1}>View task</Col>
                        <Col xs={2}>Actions</Col>
                    </Row>
                    <hr/>
                    {tasks && tasks.data && tasks.data.map((task, key) => {
                        return <Row key={key} className={`table-column ${key % 2 === 0 ? 'odd' : ''}`}>
                            <Col xs={1}>{task.id}</Col>
                            <Col xs={2}>{task.name}</Col>
                            <Col xs={2}>{task.description}</Col>
                            <Col xs={1}>{this._showUser(task.user_id)}</Col>
                            <Col xs={2}>{this._showUser(task.assign)}</Col>
                            <Col xs={1}>{this._showStatus(task.status)}</Col>
                            <Col xs={1}><Link to={{
                                pathname: '/task/'+task.id,
                                state: {task : task, users: users}
                            }}> View task </Link></Col>
                            <Col xs={2}>
                                <Button color="info" size="sm" onClick={() => this._edit(task)}>Edit</Button>
                                {user && user.role_id === 1 &&
                                <Button color="danger" size="sm" onClick={() => this._delete(task)}>Delete Task</Button> }
                            </Col>
                        </Row>;
                    })}
                </div>
                <hr/>
                <Pagination className="user-pagination">
                    <PaginationItem>
                        <PaginationLink previous href="#" />
                    </PaginationItem>
                    {DisplayPageNumbers }
                    <PaginationItem>
                        <PaginationLink next href="#" />
                    </PaginationItem>
                </Pagination>
            </Layout>
        );
    }
}