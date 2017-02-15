import React from 'react';
import axios from 'axios'
import CreateServiceModal from './CreateServiceModal'
import Select from 'react-select-plus'
import {Link, browserHistory, withRouter} from 'react-router'

export default class TeamPage extends React.Component {
	render() {
		if (!this.props.params.team) {
			return (
				<div class="container">
					<SelectTeam />
				</div>
			)
		}
		return (
			<div class="container">
				<SelectTeam team={this.props.params.team} />
				<Schedule team={this.props.params.team} />
			</div>
		)
	}
}

class Schedule extends React.Component {
	constructor() {
		super()
		this.state = {
			schedules: null
		}
	}
	componentDidMount() {
		//get schedules
		axios.get('/api/teams/getSchedulesForTeam?Name=' + this.props.team)
			.then(res => {
				console.log('got schedules')
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
		if (!this.state.schedules) {
			return <div></div>
		}
		const tabs = this.state.schedules.map(schedule => schedule.ScheduleName)
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

class SelectTeam extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			teams: null,
			value: props.team
		}
		console.log("value set")
		console.log(this.state.value)
	}

	componentWillMount() {
		axios.get("http://localhost:8080/api/teams/getTeams")
			.then((result) => {
				console.log('got teams')
				console.log(result.data)
				this.setState({teams: result.data});
			})
			.catch((err) => {
				console.log(err);
			})
	}

	handleSelected = (value) => {
		console.log("selected")
		console.log(value)
		browserHistory.push(`myteams/${value.label}`);
		window.location.reload()

		this.setState({
			value
		})
	}

	valueRenderer = (option) => {
		return <strong>{option.label}</strong>
	}

	render() {
		const mappedAllTeams = this.state.teams ? [{
			label: 'My Teams', 
			options: this.state.teams.map(team => { return {value: team.Name, label: team.Name} })
		}] : [{value: this.props.team, label: this.props.team}]

		console.log(mappedAllTeams)
		return (
			<div class="row" style={{verticalAlign: 'text-bottom'}}>
				<Select class="col-xs-4" style={{paddingLeft: '0px', verticalAlign: 'text-bottom', zIndex: "1"}} valueRenderer={this.valueRenderer} clearable={false} value={this.state.value} placeholder="Select Team" options={mappedAllTeams} onChange={this.handleSelected} />
				<input type="button" class="btn btn-secondary col-xs-4" data-container="body" value="Team Description" data-toggle="popover" data-placement="bottom" data-content="popover text"></input>
				<div class="col-xs-2"></div>
				<CreateServiceModal style={{float: "right"}} class="col-xs-2" />
			</div>
		)
	}
}


