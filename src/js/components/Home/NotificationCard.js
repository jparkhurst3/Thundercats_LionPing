import React from 'react';
import axios from 'axios';
import moment from 'moment'
import Logo from '../Logo'
import {browserHistory} from 'react-router'

export default class NotificationCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			myOpenPings: null
		}
	}

	componentDidMount() {
		axios.get("/api/pings/getMyOpenPings")
			.then(res => {
				console.log("got my open pings")
				console.log(res)
				this.setState({
					myOpenPings: res.data
				})
			}).catch(err => {
				console.log(err)
			})
	}

	onClick = (id) => {
		console.log("onclick: " + id)
		browserHistory.push(`/pings/${id}`);
	}

	render() {
		const mappedPingRows = this.state.myOpenPings ?
			this.state.myOpenPings
			.filter((ping, index) => index < 3)
			.map(ping =>
				<tr onClick={() => this.onClick(ping.ID)}>
					<td><strong>{ping.Name}</strong></td>
					<td>{moment(ping.CreatedTime).fromNow()}</td>
				</tr>)
			: <tr><td><Logo loading={true}/></td></tr>

		return (
			<div class="card home-card">
				<div class="home-card-header card-header">
					<h3>My Open Pings</h3>
				</div>
				<div class="card-block home-card-block">
					<table class="table home-table table-hover">
						<tbody>
							{mappedPingRows}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
	// <p style="" class="card-text"><small class="text-muted">Last updated {moment().calendar()}</small></p>

}
