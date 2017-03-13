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
            <div className="container">
                <form>
                    <div class="form-group">
                        <h1>Welcome to Lion Ping!</h1>
                        <input type="text" class="form-control" id="uname" placeholder="Username" />
                        <input type="password" class="form-control" id="passw" placeholder="Password" />
                        <button type="login" class="btn">Login</button>
                        <button type="register" class="btn">Register</button>
                    </div>
                </form>
            </div>
        )
    }
}
