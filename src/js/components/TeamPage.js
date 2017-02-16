import React from 'react';
import axios from 'axios'
import CreateTeamModal from './CreateTeamModal'
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
				<SchedulePane team={this.props.params.team} />
			</div>
		)
	}
}

class SchedulePane extends React.Component {
	constructor() {
		super()
		this.state = {
			schedules: null,
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

	handleScheduleChange = (schedule) => {
		console.log("handle Schedule change")
	}

	render() {
		if (!this.state.schedules) {
			return <div></div>
		}

		const mappedTabs = this.state.schedules.map((schedule) =>
			<ScheduleTab name={schedule.ScheduleName} handleScheduleChange={this.handleScheduleChange} />
		)
		const mappedData = this.state.schedules.map((schedule) => 
			<ScheduleData name={schedule.ScheduleName} schedule={schedule} handleScheduleChange={this.handleScheduleChange} />
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
	constructor() {
		super()
		this.state ={
			schedules: null
		}
	}

	render() {
		const id = '#' + this.props.name;
		return (
			<li className="nav-item">
				<a className="nav-link" data-toggle="tab" href={id} role="tab">
					{this.props.name}
				</a>
			</li>
		)
	}
}

const ex = {
	"Schedules":[
		{
			"ScheduleName":"Default",
			"OverrideShifts":[
				{
					"ID":1,
					"StartTime":"17:51:42",
					"Date":"2017-02-15T05:00:00.000Z",
					"Length":10,
					"Username":"cclegg"
				},{
					"ID":2,
					"StartTime":"17:55:06",
					"Date":"2017-02-15T05:00:00.000Z",
					"Length":10,
					"Username":"cclegg"
				}
			],
			"ManualShifts":[
				{
					"ID":1,
					"StartTime":"18:00:28",
					"Date":"2017-02-15T05:00:00.000Z",
					"Length":10,
					"Username":"cclegg",
					"Repeated":1,
					"RepeatEvery":2,
					"DaysOfWeek":{
						"Monday":true,
						"Tuesday":true,
						"Wednesday":true,
						"Thursday":true,
						"Friday":true,
						"Saturday":true,
						"Sunday":true
					}
				}
			],
			"RotationShifts":[
				{
					"ID":1,
					"StartTime":"18:14:34",
					"Date":"2017-02-15T05:00:00.000Z",
					"Length":10,
					"Repeated":1,
					"RepeatEvery":2,
					"DaysOfWeek":{"Monday":true,"Tuesday":true,"Wednesday":false,"Thursday":true,"Friday":false,"Saturday":false,"Sunday":true},
					"Users":[
						{
							"Username":"cclegg",
							"Position":1
						},{
							"Username":"zhancock",
							"Position":2
						}]
					}]
				}
			],
		"TeamName":"Database Team",
		"TeamID":1
	}





class ScheduleData extends React.Component {
	render() {
		return (
			<div className="tab-pane" id={this.props.name} role="tabpanel">
				<ul class="list-group">
					<li class="list-group-item"><strong>OverrideShifts:</strong> {JSON.stringify(this.props.schedule.OverrideShifts)}</li>
					<li class="list-group-item"><strong>ManualShifts:</strong>{JSON.stringify(this.props.schedule.ManualShifts)}</li>
					<li class="list-group-item"><strong>RotationShifts:</strong> {JSON.stringify(this.props.schedule.RotationShifts)}</li>
				</ul>
			</div>
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
		return <h3 style={{ paddingTop: '8px'}}><strong>{option.label}</strong></h3>
	}

	render() {
		const mappedAllTeams = this.state.teams ? [{
			label: 'My Teams', 
			options: this.state.teams.map(team => { return {value: team.Name, label: team.Name} })
		}] : [{value: this.props.team, label: this.props.team}]

		console.log(mappedAllTeams)
		return (
			<div class="row" style={{verticalAlign: 'text-bottom'}}>
				<Select class="col-xs-4" style={{paddingLeft: '0px', height: "50px"}} valueRenderer={this.valueRenderer} clearable={false} value={this.state.value} placeholder="Select Team" options={mappedAllTeams} onChange={this.handleSelected} />
				<input type="button" class="btn btn-secondary col-xs-4" data-container="body" value="Team Description" data-toggle="popover" data-placement="bottom" data-content="popover text"></input>
				<div class="col-xs-2"></div>
				<CreateTeamModal style={{float: "right"}} class="col-xs-2" />
			</div>
		)
	}
}


