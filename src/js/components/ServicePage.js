import React from 'react';
var moment = require('moment');
import axios from 'axios'
import {Link} from 'react-router'
import EscalationTable from './EscalationTable.js'

export default class ServicePage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			serviceID: null
		}
	}

	componentDidMount() {
		const apiCall = 'http://localhost:8080/api/services/getServices'
		console.log(apiCall)
		axios.get(apiCall)
			.then((res) => {
				console.log(res)
				const id = res.data.find(service => service.Name === this.props.params.service).ID
				// console.log(obj)
				console.log('id:' + id)
				this.setState({
					serviceID: id
				})
			})
			.catch((err) => {
				console.log(err);
			})
	}


	render() {
		if (!this.state.serviceID) {
			return <h5>loading</h5>
		}
		return (
			<div className="container">
				<h1>{this.props.params.service} Service</h1>
				<PingTable serviceID={this.state.serviceID} />
                <EscalationTable serviceID={this.state.serviceID} />
			</div>
		)
	}
}
				// <EscalationTable serviceID={this.state.serviceID} />
                // <SortableComponent />


class PingTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pings: null
		}
	}

	componentDidMount() {
		//database call for all pings for this service
		const apiCall = `http://localhost:8080/api/pings/getPingsByServiceID?ID=${this.props.serviceID}`
		console.log(apiCall);
		axios.get(apiCall)
			.then((result) => {
				console.log(result.data)
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
							<th>Name</th>
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
		const time = moment(this.props.ping.CreateTime).format('MMMM Do YYYY, h:mm:ss a')
		return (
			<tr>
				<td>{time}</td>
				<td>{this.props.ping.Name}</td>
				<td>{this.props.ping.Description}</td>
				<td>{this.props.ping.Status}</td>
			</tr>
		)
	}
}





// [
// 	{
// 		"ID":1,
// 		"ServiceID":1,
// 		"Name":"Database is broken?",
// 		"Description":"Database stopped functioning, I think the new tables from the most recent commit haven't been created and the server threw an error. Please resolve",
// 		"Status":"Acknowledged",
// 		"CreatedTime":"2017-02-02T18:43:07.000Z"
// 	},
// 	{
// 		"ID":2,
// 		"ServiceID":1,
// 		"Name":"Customer data deleted",
// 		"Description":"Client accidentally deleted all their data, requesting help with restoring backup version ASAP",
// 		"Status":"Resolved",
// 		"CreatedTime":"2017-02-02T18:43:07.000Z"
// 	}
// ]


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



