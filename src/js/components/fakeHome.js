import React from 'react'
import { connect } from "react-redux"

import { fetchSchedule, fetchPings } from '../actions/serviceActions'
import axios from 'axios'

var slackBot = require('../../../slack/slack.js');


class HomeCards extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div class="card-deck ">
				  <NotificationCard />
				  <NewPingCard />
				  <MyScheduleCard />
				</div>
			</div>
		)
	}
}

class NotificationCard extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
		<div class="card ">
			<div class="card-header">
				Notifications
			</div>
			<div class="card-block">
				<p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
			</div>
		</div>
		)
	}
}

class NewPingCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			services: null,
			description: ""
		}
		this.sendPing = this.sendPing.bind(this);
		this.handleChange = this.handleChange.bind(this)
	}

	componentDidMount() {
		axios.get("http://localhost:8080/api/services")
			.then((result) => {
				this.setState({services: result.data});
			})
			.catch((error) => {
				console.log(err);
			})
	}

	sendPing() {
		slackBot.postMessage('/services/T25EFUYP7/B3X4YAHUL/JLLTip8VjuNdkauvMRkMim9a', this.state.description);
	}

	handleChange(event) {
		this.setState({
			description: event.target.value
		});
	}

	render() {
		const mappedOptions = this.state.services ? this.state.services.map(service => <option>{service}</option>) : <option disabled>Loading</option>
		return (
		<div class="card">
		  	<div class="card-header">
			  New Ping
			</div>
		    <div class="card-block">
		      <form>
		      	<div class="form-group">
				    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Describe Issue" value={this.state.description} onChange={this.handleChange}/>
				  </div>
				  <div class="form-group">
				    <select class="form-control" id="exampleSelect1">
				      <option value="" selected disabled>Select Service</option>
				      {mappedOptions}
				    </select>
				  </div>
				  <button type="submit" class="btn" onClick={this.sendPing}>Create Ping</button>
		      </form>
		    </div>
		  </div>
		  )
	}
}

class MyScheduleCard extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div class="card">
		  	<div class="card-header">
				My Schedule
			</div>
		    <div class="card-block">
		      <p class="card-text"><h3>August 24</h3><p>8:00am - 5:00pm</p></p>
		      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
		    </div>
		  </div>
		)
	}
}



// @connect((store) => {
// 	// console.log(store)
//   return {
//     services: store.services
//   };
// })
class HomeTables extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	bgcolor: 'white',
	    	services: null
	    };
	}

	onClickHandler(e) {
		// e.preventDefault()
		// console.log(e)
		// console.log("asdf")
		// fetchSchedule("Database");
		// fetchPings("Database");

		//set style
		// console.log(this.state)
		// this.setState({
		// 	bgcolor: 'gold'
		// })
		// console.log(this.state)
		

	}

	fetchSchedule(service) {
    	this.props.dispatch(fetchSchedule(team));
  	}

  	// fetchPings(service) {
   //  	this.props.dispatch(fetchPings(team));
  	// }

	render() {
		// console.log(this.props)
		// console.log(service)
		return (
			<div className="container">
				<div className="row">
					<ServicesTable />
					<ScheduleTable />
					<PingsTable />
				</div>
			</div>
		)
	}
}

class ServicesTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			services: null
		}
	}

	componentDidMount() {
		axios.get("http://localhost:8080/api/services")
			.then((result) => {
				console.log("hdhdhservice")
				this.setState({services: result.data});
			})
			.catch((error) => {
				console.log(err);
			})
	}

	render() {
		const mappedServiceRows = this.state.services ? this.state.services.map(service => 
			<tr><td>{service}</td></tr>
		) : <tr><td>loading</td></tr>
		return (
			<div className="col-xs-4">
				<table class="table table-hover">
				  <thead className="thead-inverse">
				    <tr><th>Services</th></tr>
				  </thead>
				  <tbody>
				  	{mappedServiceRows}
				  </tbody>
				</table>
			</div>
		)
	}
}

class ScheduleTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			schedule: null
		}
	}

	componentDidMount() {
		// fetchSchedule("Database")
		console.log("component will mount")
		axios.get("http://localhost:8080/api/schedule")
			.then((result) => {
				this.setState({schedule: result.data})
			}).catch((err) => {
				console.log(err)
			})
	}

	render() {
		if (!this.state.schedule) {
			return <p>loading</p>
		}
		const mappedRows = this.state.schedule.map(s => <ScheduleRow date={s.date} name={s.name} time={s.time} />)
		return (
			<div className="col-xs-4">
				<table className="table">
				  <thead className="thead-inverse">
				    <tr><th></th><th>Schedule</th></tr>
				  </thead>
				  <tbody>
				  	{mappedRows}
				  </tbody>
				</table>
			</div>
		)
	}
}

class ScheduleRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
				<td>{this.props.date}</td>
				<td>
					<h4>{this.props.name}</h4>
					<p>{this.props.time}</p>
				</td>
			</tr>
		)
	}
}

class PingsTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			pings: null
		}
	}

	componentDidMount() {
		// fetchSchedule("Database")
		console.log("compoent will mount")
		const _this = this;
		axios.get("http://localhost:8080/api/pings")
			.then(function(result) {
				console.log("got services result")
				_this.setState({pings: result.data})
			}).catch(function(err) {
				console.log(err)
			})
	}

	render() {
		if (!this.state.pings) {
			return <h1>loading</h1>
		}
		const mappedPingRows = this.state.pings.map(ping => 
			<tr><td>{ping}</td></tr>
		)
		return (
			<div className="col-xs-4">
				<table class="table">
				  <thead className="thead-inverse">
				    <tr><th>Pings</th></tr>
				  </thead>
				  <tbody>
				  	{mappedPingRows}
				  </tbody>
				</table>
			</div>
		)
	}
}

export default class FakeHome extends React.Component {
	render() {
		return (
			<div>
				<HomeCards />
				<HomeTables />
			</div>
		)
	}
}



