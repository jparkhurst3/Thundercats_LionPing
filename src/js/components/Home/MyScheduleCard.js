import React from 'react'

export default class MyScheduleCard extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div class="card">
				<div class="card-header">
					<h3>Next On-Call</h3>
				</div>
				<div class="card-block">
					<p class="card-text"><h3>August 24</h3><p>8:00am - 5:00pm</p></p>
					<p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
				</div>
			</div>
		)
	}
}