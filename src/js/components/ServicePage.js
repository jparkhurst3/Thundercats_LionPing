import React from 'react';
var moment = require('moment');
import axios from 'axios'

export default class ServicePage extends React.Component {
	render() {
		return (
			<div className="container">
				<h1>{this.props.params.service} Service</h1>
				<PingTable service={this.props.params.service} />
				<EscalationTable service={this.props.params.serivce} />
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
		console.log(apiCall);
		axios.get(apiCall)
			.then((result) => {
				this.setState({ pings: result.data })
			})
			.error((error) => {
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
	render() {
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
							<th>Ping After</th>
							<th>Notify</th>
						</tr>
					</thead>
					<tbody>
						<EscalationRow />
						<EscalationRow />
						<EscalationRow />
					</tbody>
				</table>
			</div>
		)
	}
}

class EscalationRow extends React.Component {
	render() {
		return (
			<tr>
				<td>One</td>
				<td>Created</td>
				<td>Sam Ford</td>
			</tr>
		)
	}
}






