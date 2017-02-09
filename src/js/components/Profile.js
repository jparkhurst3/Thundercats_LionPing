import React from 'react'
import NotificationCard from './Home/NotificationCard'

export default class Profile extends React.Component {
	render() {
		return (
			<div class="container">
				<h1>Profile</h1>
				<div class="row">
					<div class="col-xs-6">
						<ProfileInfoCard />
						<PingSettings />
					</div>
					<div class="col-xs-6">
						<NotificationCard />
					</div>
				</div>
			</div>

		)
	}
}

class ProfileInfoCard extends React.Component {
	render() {
		return (
			<div class="card">
				<div class="card-header">
					<h3>Profile Info</h3>
				</div>
				<div class="card-block">
					<span class="card-text"><h5>Name: Sam Ford </h5></span>
					<span class="card-text"><h5>Username: sford34</h5></span>
					<span class="card-text"><h5>Change password ? </h5></span>
				</div>
			</div>
		)
	}
}

class PingSettings extends React.Component {
	render() {
		return (
			<div class="card">
				<div class="card-header">
					<h3>Ping Settings</h3>
				</div>
				<div class="card-block">
					<span class="card-text"><h5>Add/Edit Email </h5></span>
					<span class="card-text"><h5>Add/Edit Slack Channel</h5></span>
					<span class="card-text"><h5>Add/Edit Phone</h5></span>
				</div>
			</div>
		)
	}
}