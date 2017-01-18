import React from 'react';

export default class TeamPage extends React.Component {
	render() {
		return (
			<div>
				<h1>Thundercats</h1>
				<Schedule />
			</div>
		)
	}
}

class Schedule extends React.Component {
	render() {
		// return (
		// 	<div>
		// 		<ul class="nav nav-tabs" role="tablist">
		// 		  <li class="nav-item">
		// 		    <a class="nav-link active" data-toggle="tab" href="#home" role="tab">Sc</a>
		// 		  </li>
		// 		  <li class="nav-item">
		// 		    <a class="nav-link" data-toggle="tab" href="#profile" role="tab">Profile</a>
		// 		  </li>
		// 		  <li class="nav-item">
		// 		    <a class="nav-link" data-toggle="tab" href="#messages" role="tab">Messages</a>
		// 		  </li>
		// 		  <li class="nav-item">
		// 		    <a class="nav-link" data-toggle="tab" href="#settings" role="tab">Settings</a>
		// 		  </li>
		// 		</ul>

		// 		<div class="tab-content">
		// 		  <div class="tab-pane active" id="home" role="tabpanel">Primary</div>
		// 		  <div class="tab-pane" id="profile" role="tabpanel">Boobies</div>
		// 		  <div class="tab-pane" id="messages" role="tabpanel">asdf</div>
		// 		  <div class="tab-pane" id="settings" role="tabpanel">...</div>
		// 		</div>
		// 	</div>
		// )

		const tabs = ['Primary', 'Holiday']
		const mappedTabs = tabs.map((tab) =>
			<ScheduleTab name={tab} />
		)
		const mappedData = tabs.map((tab) => 
			<ScheduleData name={tab} />
		)

		return (
			<div>
				<ul class="nav nav-tabs" role="tablist">
					{mappedTabs}
				</ul>
				<div class="tab-content">
					{mappedData}
				</div>
			</div>
		)
	}
}

class ScheduleTab extends React.Component {
	render() {
		const id = '#' + this.props.name;
		return (
			<li className="nav-item">
				<a className="nav-link" data-toggle="tab" href={id} role="tab">{this.props.name}</a>
			</li>
		)
	}
}

class ScheduleData extends React.Component {
	render() {
		return (
			<div className="tab-pane" id={this.props.name} role="tabpanel">{this.props.name}</div>
		)
	}
}






