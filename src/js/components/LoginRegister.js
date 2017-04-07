/* flow */

import React from 'react';
var Select = require('react-select');
import axios from 'axios'
import auth from '../auth.js'

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
    constructor(props) {
        super(props);
        this.state = {
            Username: "",
            Password: ""
        }
    }
    handleLogin = (event) => {
        event.preventDefault();
        auth.login(this.state.Username, this.state.Password).then((response)=> {
            console.log("logged in");
            console.log(response);
        }).catch((error)=> {
            console.log("error");
            console.log(error);
        });
        // axios.post('/auth/login', this.state)
        //     .then(res => {
        //         console.log("logged in");
        //         console.log(res);
        //     })
        //     .catch(err => {
        //         console.log("login error");
        //         console.log(err)
        //     })
    }
    handleRegister = (event) => {
        event.preventDefault();
        console.log("register clicked");
        auth.logout().then((response)=> {
            console.log("logged in");
            console.log(response);
        }).catch((error)=> {
            console.log("error");
            console.log(error);
        });;
        // axios.get('/auth/getCurrentUser')
        //     .then(res => {
        //         console.log("logged in");
        //         console.log(res.data);
        //     })
        //     .catch(err => {
        //         console.log("login error");
        //         console.log(err)
        //     })
    }
    usernameChanged = (event) => {
        // console.log(event)
        this.state.Username = event.target.value;
    }
    passwordChanged = (event) => {
        this.state.Password = event.target.value;
    }
    render() {
        return (
            <div class="card">
                <div class="card-block">
                        <input type="text" class="form-control" id="uname" onChange={this.usernameChanged} placeholder="Username" />
                        <input type="password" class="form-control" id="passw" onChange={this.passwordChanged} placeholder="Password" />
                        <input type="button" class="btn" value="Login" onClick={this.handleLogin}></input>
                        <input type="button" class="btn" value="Register" onClick={this.handleRegister}></input>
                </div>
            </div>
        )
    }
}
