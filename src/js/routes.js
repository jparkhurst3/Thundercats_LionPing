/* @flow */

import React from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory, IndexLink } from 'react-router'
import ReactDOM from 'react-dom'
import Home from './components/Home.js'
import SideBar from './components/SideBar.js'
import TeamPage from './components/TeamPage.js'
import ServicePage from './components/ServicePage.js'
import ServicesList from './components/ServicesList.js'
import TeamsList from './components/TeamsList.js'
import Profile from './components/Profile'
import LoginRegister from './components/LoginRegister.js'
import PingResponse from './components/PingResponse.js'
import { Logo2 } from './components/Logo.js'
import Select from 'react-select'

import axios from 'axios'
import auth from './auth.js'

class Routes extends React.Component {
  render() {
	return (
	  <div>
		<Router history={browserHistory}>
		  <Route path='/' component={Container}>
			<IndexRoute component={Home} />

			<Route path="/pings" component={Pings} />
      <Route path="/pings/:id" component={PingResponse} />

			<Route path="/faq" component={FAQ} />
			<Route path="/gettingstarted" component={GettingStarted} />
			<Route path='/profile' component={Profile} />

			<Route path='/services' component={ServicePage} />
			<Route path='/services/:service' component={ServicePage} />

			<Route path='/teams' component={TeamPage} />
			<Route path='/teams/:team' component={TeamPage} />

			<Route path='*' component={NotFound} />
		  </Route>
		</Router>
	  </div>
	)
  }
};

class Container extends React.Component {
  constructor() {
    super()
    this.state = {
      currentUser: null,
      loaded: false,
      loggedIn: false
    }
  }

  componentDidMount() {
    console.log("container mounted")
    auth.getCurrentUser()
      .then(res => {
        console.log("getCurrentUser:")
        console.log(res)
        this.setState({
          loaded: true,
          loggedIn: true,
          currentUser: res
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          loggedIn: false,
          loaded: true,
        })

      })
  }

  login = (user) => {
    console.log("loggin")
    this.setState({
      currentUser: user,
      loggedIn: true
    })
  }

  logout = () => {
    auth.logout().then((response)=> {
        console.log("logged in");
        console.log(response);
        this.setState({
          currentUser: null,
          loggedIn: false,
          // loaded: true
        })
    }).catch((error)=> {
        console.log("error");
        console.log(error);
    });
  }

  // <div class="centered-icon">
  //   <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
  // </div>

  render() {
    // this.checkLogin()
    if (!this.state.loaded) {
      return (
        <div class="centered-icon">
          <Logo2 />
        </div>
      )
    }

    if (!this.state.loggedIn) {
      console.log("no current user")
      // console.log(this.state.currentUser)
      return (
        <LoginRegister login={this.login} />
      )
    }

  	return (
  	  <div className="container-fluid">
    		<div className="row">
    		  <div className="col-xs-2">
    			   <SideBar loading={true} logout={this.logout} />
    		  </div>
    		  <div className="col-xs-10">
    		  	<NavBar currentUser={this.state.currentUser} />
    			  {this.props.children}
    		  </div>
    		</div>
  	  </div>
  	)
  }
}

class NavBar extends React.Component {
  constructor() {
    super()
    this.state = {
      value: null
    }
  }

  handleSelected = (value) => {
    //go to service, team, or ping response page
    console.log("handle selected")
    console.log(value)
    if (value) {
  		browserHistory.push(`myservices/${value.label}`);
  		this.setState({
  			value: ''
  		})
    }
	}

  search = (input) => {
    console.log("input")
    console.log(input)

    if (!input) {
      return Promise.resolve({options: []})
    }
    // return Promise.resolve({options: []})

    // return axios.get("search/" + input)
    //   .then(res => {
    //     return {options: res}
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })

    return axios.get("/api/services/getNames")
			.then((result) => {
				console.log(result.data)
				// console.log(result.data[0)
        return {options: result.data.map(val => { return {value: val, label: val}})}
			})
			.catch((error) => {
				console.log(error);
			})
  }

  render() {
    return (
      <div className="container row" style={{paddingBottom: '20px', paddingTop: '20px', paddingRight:'0px', marginRight: '0px'}}>
      	<div class="col-xs-4">
          <Select.Async class="" style={{paddingLeft: '0px'}} value={this.state.value} placeholder="Search" loadOptions={this.search} onChange={this.handleSelected} />
      	</div>
      	<div class="col-xs-8" style={{textAlign: "right"}}>
			     <h4><Link style={{display:"inline-block"}} to="/profile">{this.props.currentUser.Username}</Link></h4>
      	</div>
      </div>
    )
  }
};

class NotFound extends React.Component {
  render() {
  	return (
  	  <div class="container">
  		<h1>404 Not Found</h1>
  	  </div>
  	)
  }
}

class Pings extends React.Component {
  render() {
	return (
	  <div class="container">
		<h1>Pings</h1>
	  </div>
	)
  }
}

class FAQ extends React.Component {
  render() {
	return (
		<div class="container">
			<h1>FAQ</h1>
			<h2>Common Questions</h2>
			<h3>Question 1</h3>
			<p>Answer</p>
			<h3>Question 2</h3>
			<p>Answer</p>
			<h3>Question 3</h3>
			<p>Answer</p>
		</div>
	)
  }
}

class GettingStarted extends React.Component {
  render() {
	return (
		<div class="container">
			<h1>Getting Started</h1>
		</div>
	)
  }
}

export default Routes;
