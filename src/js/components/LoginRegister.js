/* flow */

import React from 'react';
var Select = require('react-select');
import axios from 'axios'
import auth from '../auth.js'
import Logo from './Logo'

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
              <LoginCard {...this.props} />
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
            auth.getCurrentUser()
              .then(res => {
                this.props.login(res)
              })
              .catch(err => {
                console.log(err)
              })
            // this.props.login({username: "sford"})
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
          <div class="card login-card">
            <div class="card-header home-card-header">
              <h3>Login to Lion Ping</h3>
            </div>
            <div class="card-block">
              <input type="text" style={{marginBottom: "20px"}} class="form-control" id="uname" onChange={this.usernameChanged} placeholder="Username" />
              <input type="text" class="form-control" id="passw" onChange={this.passwordChanged} placeholder="Password" />
              <input type="button" class="btn" value="Login" onClick={this.handleLogin}></input>
              <input type="button" class="btn" value="Register" onClick={this.handleRegister}></input>
            </div>
          </div>
        )
    }
}
