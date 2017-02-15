import React from 'react';
import axios from 'axios'

export default class TeamPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			schedules: null
		}
	}

	componentDidMount() {
		//get schedules
		axios.get('/api/teams/getSchedulesForTeam?Name=' + this.props.params.team)
			.then(res => {
				console.log('got schedyles')
				console.log(res.data)
				this.setState({
					schedules: res.data.Schedules
				})
			})
			.catch(err => {
				console.log(err)
			})
	}

	render() {
		return (
			<div>
				<h1>{this.props.params.team}</h1>
				{this.state.schedules ? <Schedule schedules={this.state.schedules} /> : <div></div>}
			</div>
		)
	}
}

class Schedule extends React.Component {
	render() {
		const tabs = this.props.schedules.map(schedule => schedule.ScheduleName)
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