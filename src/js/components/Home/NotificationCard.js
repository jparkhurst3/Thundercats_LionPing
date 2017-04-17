import React from 'react';
import axios from 'axios';
import moment from 'moment'

export default class NotificationCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			unresolvedPings: null
		}
	}

	componentDidMount() {
		// axios
	}

	render() {
		const mappedPingRows = this.state.unresolvedPings ?
			this.state.pings.map(ping =>
				<tr onClick={() => this.onClick(ping.ID)}><td>{ping.Name}</td></tr>)
			: null

		return (
			<div class="card home-card">
				<div class="home-card-header card-header">
					<h3>My Unresolved Pings</h3>
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
