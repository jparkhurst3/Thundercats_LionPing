/* flow */

import React from 'react';
var Select = require('react-select');
import axios from 'axios'

export default class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usname: null,
            pw: null
        }
    }

    render() {
        return (

            <div class="container">
                <h1>Welcome to Lion Ping!</h1>
                <div class="row">
                    <div class="col-xs-6">
                        <LoginCard />
                    </div>
                </div>
            </div>
        )
    }
}


class LoginCard extends React.Component {
    render() {
        return (
            <div class="card">
                <div class="card-block">
                        <input type="text" class="form-control" id="uname" placeholder="Username" />
                        <input type="password" class="form-control" id="passw" placeholder="Password" />
                        <button type="login" class="btn">Login</button>
                        <button type="register" class="btn">Register</button>
                </div>
            </div>
        )
    }
}