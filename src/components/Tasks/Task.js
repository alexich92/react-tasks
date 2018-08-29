import React, {Component} from 'react';
import Layout from "../Misc/Layout";
import axios from "axios";
import {Badge,ModalFooter, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input,Row,Col} from 'reactstrap';
import Moment from 'react-moment';
import '../../css/Task.css';


export default class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.location.state.task,
            comment:'',
            shouldRerender: false,
            comments:[],
            open:false,
            logs:[],
            users:this.props.location.state.users
        }
    }

    _onChange = (e) => {
        const {name, value} = e.target;

        this.setState({
            [name]: value
        });
    };

    _toggle = () => {
        this.setState({
            open: !this.state.open
        });
    };


    async componentDidMount() {
        let res = await axios.get(process.env.REACT_APP_API_URL + `task/${this.state.task.id}/comments`);
        if (res && res.data && res.data.responseType === 'success') {
            this.setState({
                comments:res.data.data,
            });
        }
    }


    async componentDidUpdate() {
        if (this.state.shouldRerender) {
            let res = await axios.get(process.env.REACT_APP_API_URL + `task/${this.state.task.id}/comments`);
            this.setState({
                shouldRerender: false,
                comments:res.data.data
            });
        }
    }


    _showType = type => {
        switch (type) {
            case 0:
                return  <Badge color="info" pill>Status update</Badge>;
            case 1:
                return <Badge color="success" pill>Assignment update</Badge>;
            default:
                return <Badge color="danger" pill>Unknown</Badge>;
        }
    };

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




    _addComment = async () => {
        const {comment} = this.state;

        let res = await axios.post(process.env.REACT_APP_API_URL + `task/${this.state.task.id}/comment`, {comment});

        if (res && res.data && res.data.responseType === 'success') {
            this.setState({
                shouldRerender: true,
                comment:''
            });
        }
    };

    _getLogs = async () =>{
        let res = await axios.get(process.env.REACT_APP_API_URL + `task/${this.state.task.id}/logs`);

        if (res && res.data && res.data.responseType === 'success') {
            this.setState({
                logs: res.data.data,
                open:true,
            });
        }
    }

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
        const {task,comment,comments,open,logs} = this.state;

        return (
            <Layout>
                <h1 className='text-center'>Task nr#{task.id}</h1>
                <div className="task-box">
                    <h5>Task name: {task.name}</h5>
                    <hr/>
                    <h5>Task description: {task.description}</h5>
                    <hr/>
                    <h5>Assigned to : {this._showUser(task.assign)}</h5>
                    <hr/>
                    <h5>Created by : {this._showUser(task.user_id)}</h5>
                    <hr/>
                    <h5>Status: {this._showStatus(task.status)}</h5>
                </div>
                <Button color="primary" style={{float:'right'}}  onClick={this._getLogs}>Logs</Button>
                <Row className="add-comment-row">
                    <Col xs="8">
                        <Form inline>
                            <FormGroup>
                                <Label for="comment">Leave a comment:</Label>
                                <Input type="textarea" value={comment}
                                       onChange={this._onChange} name="comment" rows='1' cols='50' id="comment" />
                            </FormGroup>
                            <Button style={{float:'right'}}  onClick={this._addComment}>Submit</Button>
                        </Form>
                    </Col>
                </Row>
                {!comments.length ? <h4 className='text-center'>There are no comments</h4> : <h4 className='text-center'>Comments</h4>}
                <div className="comments-row" style={{paddingBottom:'100px'}}>
                    {comments && comments.map((comment, key) => {
                        return <Row className='comments' key={key}>
                            <Col xs={2} className="comment-name-col">{this._showUser(comment.user_id)} commented: </Col>
                            <Col xs={8}>{comment.comment}</Col>
                            <Col xs={2} className="comment-date-col"><Moment format="DD/MM/YYYY">{comment.created_at}</Moment></Col>
                        </Row>;
                    })}
                </div>

                <Modal isOpen={open} toggle={this._toggle} size="lg">
                    <ModalHeader>Task logs</ModalHeader>
                    <ModalBody>
                       <Row className={'table-header'}>
                            <Col xs={1}>Id</Col>
                            <Col xs={3}>Type</Col>
                            <Col xs={3}>Old</Col>
                            <Col xs={3}>New</Col>
                            <Col xs={2}>Date</Col>

                        </Row>
                        {logs &&  logs.map((log, key) => {
                            return <Row key={key}>
                                <Col xs={1}>{log.id}</Col>
                                <Col xs={3}>{this._showType(log.type)}</Col>
                                <Col xs={3}>{log.type === 0 ? this._showStatus(Number(log.old_value)) : this._showUser(Number(log.old_value))}</Col>
                                <Col xs={3}>{log.type === 0 ? this._showStatus(Number(log.new_value)) : this._showUser(Number(log.new_value))}</Col>
                                <Col xs={2}><Moment format="DD/MM/YYYY">{log.created_at}</Moment></Col>
                            </Row>;
                        })}

                        </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this._toggle}>Go back</Button>
                    </ModalFooter>
                </Modal>
            </Layout>
        );
    }
}