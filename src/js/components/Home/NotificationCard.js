import React from 'react';

export default class NotificationCard extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<div class="card home-card">
				<div class="home-card-header card-header">
					<h3>Notifications</h3>
				</div>
				<div class="card-block">
					<p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
				</div>
			</div>
		)
	}
}
