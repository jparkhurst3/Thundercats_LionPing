import React from 'react';
var moment = require('moment');
import axios from 'axios'
import {Link} from 'react-router'

export default class PingTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pings: null
		}
	}

	componentDidMount() {
		//database call for all pings for this service
		const apiCall = `/api/pings/getPingsForService?Name=${this.props.service}`
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
		const time = moment(this.props.ping.CreatedTime).format('MMMM Do YYYY, h:mm:ss a')
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