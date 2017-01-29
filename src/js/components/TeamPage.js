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
		const tabs = ['Primary', 'Holiday', 'Secondary', 'Sick']
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






