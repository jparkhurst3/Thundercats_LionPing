import React from 'react';
var moment = require('moment');

export default class ServicePage extends React.Component {
	render() {
		return (
			<div className="container">
				<h1>Database Service</h1>
				<PingTable />
				<EscalationTable />
			</div>
		)
	}
}

class PingTable extends React.Component {
	// const mappedServices = services.map
	// const mappedRows = services.map
	render() {
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
						<PingRow />
						<PingRow />
						<PingRow />
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
				<td>{moment().format('MMMM Do YYYY, h:mm:ss a')}</td>
				<td>Servers down</td>
				<td>Open</td>
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






