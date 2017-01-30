import React from 'react';

export default class NotificationCard extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
		<div class="card ">
			<div class="card-header">
				Notifications
			</div>
			<div class="card-block">
				<p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
			</div>
		</div>
		)
	}
}