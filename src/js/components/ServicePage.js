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