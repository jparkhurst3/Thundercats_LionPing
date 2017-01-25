import React from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory, IndexLink } from 'react-router'
import ReactDOM from 'react-dom'
import Home from './components/Home.js'
import SideBar from './components/SideBar.js'
import TeamPage from './components/TeamPage.js'
import ServicePage from './components/ServicePage.js'
import CreateTeamPage from './components/CreateTeam.js'


class Routes extends React.Component {
  render() {
    return (
      <div>
        <Router history={browserHistory}>
          <Route path='/' component={Container}>
            <IndexRoute component={Home} />
            <Route path="/pings" component={Pings} />
            <Route path="/teams" component={Teams} />
            <Route path="/help" component={Help} />
            <Route path='/profile' component={Profile} />
            <Route path='/schedule' component={TeamPage} />
            <Route path='/services' component={ServicePage} />
            <Route path='/createTeam' component={CreateTeamPage} />
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

 // style={{'textAlign': 'right'}}

class NavBar extends React.Component {
  render() {
    return (
        <h5 style={{textAlign: 'right'}}><Link class="nav-link" to={'profile'}>Sam Ford</Link></h5>
    )
  }
}

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
    return <h1>Help</h1>
  }
}
class Profile extends React.Component {
  render() {
    return <h1>Profile</h1>
  }
}



export default Routes;