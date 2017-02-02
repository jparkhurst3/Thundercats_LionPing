import React from 'react';
var moment = require('moment');
import axios from 'axios'
import {Link} from 'react-router'

export default class ServicePage extends React.Component {
	render() {
		return (
			<div className="container">
				<h1>{this.props.params.service} Service</h1>
				<PingTable service={this.props.params.service} />
				<EscalationTable service={this.props.params.service} />
			</div>
		)
	}
}

class PingTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pings: null
		}
	}

	componentDidMount() {
		//database call for all pings for this service
		const apiCall = `http://localhost:8080/api/services/${this.props.service}/pings`
		axios.get(apiCall)
			.then((result) => {
				this.setState({ pings: result.data })
			})
			.catch((error) => {
				console.log(error)
			})
	}

	render() {
		const mappedPingRows = this.state.pings ? this.state.pings.map((ping) => <PingRow ping={ping} />) : <tr><td>loading</td></tr>
		return (
			<div>
				<h3>Pings</h3>
				<table class="table table-hover">
					<thead className="thead-inverse">
						<tr>
							<th>Created At</th>
							<th>Description</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{mappedPingRows}
					</tbody>
				</table>
			</div>
		)
	}
}

class PingRow extends React.Component {
	render() {
		return (
			<tr>
				<td>{this.props.ping.createdAt}</td>
				<td>{this.props.ping.description}</td>
				<td>{this.props.ping.status}</td>
			</tr>
		)
	}
}

class EscalationTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			layers: null
		}
	}

	componentDidMount() {
		console.log('mounted')
		// const apiCall = 'http://localhost:8080/api/services/getEscalationPolicyByID?ID=' + '1';
		// [{"ID":1,"Name":"Database"},{"ID":2,"Name":"UI"},{"ID":3,"Name":"Server"}]
		const apiCall = 'http://localhost:8080/api/services/getServices'
		console.log(this.props.service)
		axios.get(apiCall)
			.then((res) => {
				const id = res.data.find(service => service.Name === this.props.service).ID
				const apiCall2 = 'http://localhost:8080/api/services/getEscalationPolicyByID?ID=' + id;
				axios.get(apiCall2)
					.then(res => {
						this.setState({
							layers: res.data.Layers.sort((a,b) => a.Level - b.Level)
						})
					})
					.catch(err => {
						console.log(err);
					})
			})
			.catch((err) => {
				console.log(err);
			})
	}

	render() {
		const mappedLayers = this.state.layers ? this.state.layers.map(layer => {
			const level = layer.Level;
			const delay = layer.Delay;
			const users = layer.Users;
			const schedules = layer.Schedules;
			return (
				<EscalationLayer level={level} delay={delay} users={users} schedules={schedules} />
			)
			}
		) : <tr><td>loading</td></tr>


		return (
			<div>
				<div className="row">
					<div className="col-xs-3">
						<h3>Escalation Policy</h3>
					</div>
					<div className="col-xs-9">
						<button type="submit" class="btn">Edit</button>
					</div>
				</div>
				<table class="table table-hover">
					<thead className="thead-inverse">
						<tr>
							<th>Level</th>
							<th>Delay</th>
							<th>Users</th>
						</tr>
					</thead>
					<tbody>
						{mappedLayers}
					</tbody>
				</table>
			</div>
		)
	}
}

class EscalationLayer extends React.Component {
	render() {
		const mappedUsers = this.props.users.map(user => 
			<li><Link to={`/users/${user.Username}`}>{user.Username}</Link></li>
		)
		return (
			<tr>
				<td>{this.props.level}</td>
				<td>{this.props.delay} minutes</td>
				<td><ul className="list-inline">{mappedUsers}</ul></td>
			</tr>
		)
	}
}


// {"ID":"1",
// "Layers":[
// 	{"Level":2,
// 	"Delay":10,
// 	"Users":[
// 		{"Username":"hkim","FirstName":"Ho Keun","LastName":"Kim"}],
// 	"Schedules":[
// 		{"TeamID":1,"TeamName":"Database Team","ScheduleName":"Default"}]},
// 	{"Level":1,
// 	"Delay":0,
// 	"Users":[
// 		{"Username":"cclegg","FirstName":"Chris","LastName":"Clegg"},
// 		{"Username":"sford","FirstName":"Sam","LastName":"Ford"}],
// 		"Schedules":[]}]}



