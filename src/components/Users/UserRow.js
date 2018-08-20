import React, {Component} from 'react';
import {Row, Col, Button,Badge} from 'reactstrap';
import PropTypes from 'prop-types';

export default class UserRow extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        edit: PropTypes.func.isRequired,
        deleted:PropTypes.func.isRequired,
    };

    _showRole = role => {
        switch (role) {
            case 1:
                return  <Badge color="danger" pill>Admin</Badge>;
            case 2:
                return <Badge color="success" pill>User</Badge>;
            default:
                return <Badge color="secondary" pill>Unknown</Badge>;
        }
    };

    _edit = (user) => {
        const {edit} = this.props;

        edit && edit(user);

    };
    _delete = (user) =>{
        const {deleted} = this.props;

        deleted && deleted(user)
    }





    render() {
        const {user} = this.props;


        return (
            <Row style={{padding:'5px'}}>
                <Col xs={1}>{user.id}</Col>
                <Col xs={3}>{user.name}</Col>
                <Col xs={4}>{user.email}</Col>
                <Col xs={2}>{this._showRole(user.role_id)}</Col>
                <Col xs={1}>
                    <Button color="secondary" size="sm" onClick={() => this._edit(user)}>Edit</Button>
                </Col>
                <Col xs={1}>
                    <Button color="danger" size="sm" onClick={() => this._delete(user)}>Delete</Button>
                </Col>
            </Row>
        );
    }
}