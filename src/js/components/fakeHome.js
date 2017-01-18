import React from 'react'
import { connect } from "react-redux"

import { fetchSchedule, fetchPings } from '../actions/serviceActions'

class HomeCards extends React.Component {
	render() {
		return (
			<div>
				<div class="card-deck ">
				  <div class="card ">
					<div class="card-header">
					  Notifications
					</div>
				    <div class="card-block">
				      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
				    </div>
				  </div>
				  <div class="card">
				  	<div class="card-header">
					  New Ping
					</div>
				    <div class="card-block">
				      <form>
				      	<div class="form-group">
						    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Describe Issue" />
						  </div>
						  <div class="form-group">
						    <select class="form-control" id="exampleSelect1">
						      <option value="" selected disabled>Select Service</option>
						      <option>Database</option>
						      <option>Servers</option>
						      <option>Web App</option>
						    </select>
						  </div>
						  <button type="submit" class="btn">Create Ping</button>
				      </form>
				    </div>
				  </div>
				  <div class="card">
				  	<div class="card-header">
						My Schedule
					</div>
				    <div class="card-block">
				      <p class="card-text"><h3>August 24</h3><p>8:00am - 5:00pm</p></p>
				      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
				    </div>
				  </div>
				</div>
			</div>
		)
	}
}

@connect((store) => {
	console.log(store)
  return {
    services: store.services
  };
})
class HomeTables extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {bgcolor: 'white'};
	}

	componentWillMount() {
		// fetchSchedule("Database")
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
		console.log(this.props)
		// console.log(service)
		return (
			<div className="container">
				<div className="row">
					<div className="col-xs-4">
						<table class="table table-hover">
						  <thead className="thead-inverse">
						    <tr><th>Services</th></tr>
						  </thead>
						  <tbody>
						    <tr onClick={this.onClickHandler.bind(this)}><td>Database</td></tr>
						    <tr><td>Servers</td></tr>
						    <tr><td>Web App</td></tr>
						  </tbody>
						</table>
					</div>
					<div className="col-xs-4">
						<table className="table">
						  <thead className="thead-inverse">
						    <tr><th></th><th>Schedule</th></tr>
						  </thead>
						  <tbody>
						    <tr>
						    	<td>Aug 25</td>
						    	<td>
							    	<h4>Sam</h4>
							    	<p>8:00am - 5:00pm</p>
						    	</td>
						    </tr>
						    <tr>
						    <td>Aug 25</td>
						    	<td>
							    	<h4>Chris</h4>
							    	<p>5:00pm - 8:00am</p>
						    	</td>
						    </tr>
						    <tr>
						    <td>Aug 26</td>
						    	<td>
							    	<h4>Jo</h4>
							    	<p>8:00am - 5:00pm</p>
						    	</td>
						    </tr>
						    <tr>
						    <td>Aug 26</td>
						    	<td>
							    	<h4>Zack</h4>
							    	<p>5:00pm - 8:00am</p>
						    	</td>
						    </tr>
						    <tr>
						    <td>Aug 27</td>
						    	<td>
							    	<h4>HoKeun</h4>
							    	<p>8:00am - 5:00pm</p>
						    	</td>
						    </tr>
						  </tbody>
						</table>
					</div>
					<div className="col-xs-4">
						<table class="table">
						  <thead className="thead-inverse">
						    <tr><th>Pings</th></tr>
						  </thead>
						  <tbody>
						    <tr><td>Processing time degraded...</td></tr>
						    <tr><td>Power outage on...</td></tr>
						    <tr><td>Y2K hit...</td></tr>
						  </tbody>
						</table>
					</div>
				</div>
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



