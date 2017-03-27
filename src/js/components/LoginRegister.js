/* flow */

import React from 'react';
var Select = require('react-select');
import axios from 'axios'

export default class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Username: null,
            Password: null
        }
    }

    handleLogin = () => {

        var loginInfo = {
            Username : this.state.Username,
            Password : this.state.Password
        };
        console.log("handle login function")
        console.log(loginInfo);
        console.log(this.state);
        console.log(this.props);
         axios.post('/auth/login', loginInfo)
            .then(res => {
                console.log("logged in, response: ");
                console.log(res);
            })
            .catch(err => {
                console.log(err)
            });
    }

    handleChange = (event) => {
        event.preventDefault()
        console.log(event.target.name)
        console.log(event.target.value)
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div className="container">
                <form>
                    <div class="form-group">
                        <h1>Welcome to Lion Ping!</h1>
                        <input type="text" class="form-control" name="Username" id="uname" placeholder="Username" onChange={this.handleChange}/>
                        <input type="password" class="form-control"  name="Password" id="passw" placeholder="Password" onChange={this.handleChange}/>
                        <button type="login" class="btn" onClick={this.handleLogin}>Login</button>
                        <button type="register" class="btn">Register</button>
                    </div>
                </form>
            </div>
        )
    }
}
