import React from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory, IndexLink } from 'react-router'
import ReactDOM from 'react-dom'
import Home from './components/Home.js'
import SideBar from './components/SideBar.js'
import TeamPage from './components/TeamPage.js'
import ServicePage from './components/ServicePage.js'
import CreateTeamPage from './components/CreateTeam.js'
import ServicesList from './components/ServicesList.js'
import TeamsList from './components/TeamsList.js'
import CreateServiceModal from './components/CreateServiceModal'


class Routes extends React.Component {
  render() {
	return (
	  <div>
		<Router history={browserHistory}>
		  <Route path='/' component={Container}>
			<IndexRoute component={Home} />
			<Route path="/pings" component={Pings} />
			<Route path="/help" component={Help} />
			<Route path='/profile' component={Profile} />
			
			<Route path='/myservices' component={ServicesList} />
			<Route path='/myservices/:service' component={ServicePage} />

			<Route path='/myteams' component={TeamsList} />
			<Route path='/myteams/:team' component={TeamPage} />
			<Route path='/createteam' component={CreateTeamPage} />

			<Route path='*' component={NotFound} />
		  </Route>
		</Router>
	  </div>
	)
  }
};

class Container extends React.Component {
  render() {
	return (
	  <div className="container-fluid">
		<NavBar />
		<div className="row">
		  <div className="col-xs-2">
			<SideBar />
		  </div>
		  <div className="col-xs-10">
			{this.props.children}
		  </div>
		</div>
	  </div>
	)
  }
}

class NavBar extends React.Component{
  render() {
    return (
      <div className="header clearfix">
            <ul className="nav nav-pills float-xs-right" style={{fontSize: '20px'}}>
              <li className="nav-item">
              	<Link className="nav-link" to="/profile">Sam Ford</Link>
              </li>
            </ul>
      </div>
    )
  }
};

class NotFound extends React.Component {
  render() {
	return <h1>NOT FOUND</h1>
  }
}
class Pings extends React.Component {
  render() {
	return (
	  <div>
		<h1>Pings</h1>
	  </div>
	)
  }
}

class Teams extends React.Component {
  render() {
	return <h1>Teams</h1>
  }
}
class Help extends React.Component {
  render() {
	// return <h1>Help</h1>
	return <CreateServiceModal />
  }
}
class Profile extends React.Component {
  render() {
	return <h1>Profile</h1>
  }
}



export default Routes;