import React, {Component} from "react";
import axios from "axios";

export const LoggedUser = (WrappedComponent) => {
    return class extends Component {
        constructor(props) {
            super(props);

            this.state = {
                user: false
            };
        }

        async componentDidMount() {
            if (sessionStorage.getItem('token')) {
                let res = await axios.get('http://api.tasks.local/v1/user');
                if (res && res.data && res.data.responseType === 'success') {
                    this.setState({
                        user: res.data.data
                    });
                }
            }
        }

        render() {
            return <WrappedComponent {...this.props} user={this.state.user}/>;
        }
    };
};
