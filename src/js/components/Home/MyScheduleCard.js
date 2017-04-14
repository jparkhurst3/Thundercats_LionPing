import React from 'react'

export default class MyScheduleCard extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div class="card home-card">
				<div class="card-header home-card-header">
					<h3>Currently On-Call</h3>
				</div>
				<div class="card-block">
					<p class="card-text"><h3>Database Service</h3><p>1st Escaltion :: Until 8:00pm</p></p>
					<p class="card-text"><h3>UI Service</h3><p>4th Escalation :: Always</p></p>

				</div>
			</div>
		)
	}
}
