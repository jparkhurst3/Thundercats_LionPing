import React from 'react';
import axios from 'axios'
import CreateTeamModal from './CreateTeamModal'
import Select from 'react-select-plus'
import {Link, browserHistory, withRouter} from 'react-router'
import SearchInput, {createFilter} from 'react-search-input'

import Timeline from 'react-calendar-timeline'
import moment from 'moment'


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
                        searchTerm: '',
                        searchTags: ['']
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
			return <div style={{paddingTop: '20px'}}></div>
		}

		const mappedTabs = this.state.schedules.map((schedule, key) =>
			<ScheduleTab active={key == 1} name={schedule.ScheduleName} handleScheduleChange={this.handleScheduleChange} />
		)
		const mappedData = this.state.schedules.map((schedule) => 
			<ScheduleData name={schedule.ScheduleName} schedule={schedule} handleScheduleChange={this.handleScheduleChange} />
		)

		return (
			<div style={{paddingTop: '20px'}}>
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
			<li className={this.props.active ? "nav-item active" : "nav-item"}>
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
					"Repeated":1, //this is a boolean
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
	constructor(props) {
		super(props)
	}

	//takes in a shift from the database and converts it to the correct format
	formatOverrideShift = (shift) => {

	}


	render() {
		console.log(this.props.schedule)
		const overrideShifts = this.props.schedule.OverrideShifts;
		// console.log("overrideShifts")
		// console.log(overrideShifts)


		const exa = {
			"ID":2,
			"StartTime":"17:55:06",
			"Date":"2017-02-15T05:00:00.000Z",
			"Length":10,
			"Username":"cclegg"
		}

		const mappedOverrideShifts = overrideShifts.map((shift, key) => {
			return {
				id: shift.ID, group: 3, title: shift.Username, start_time: moment(shift.StartTime), end_time: moment(shift.StartTime).add(shift.Length, 'hour')
			}
		})
		// console.log("mappedOverrideShifts")
		// console.log(mappedOverrideShifts)

		const groups = [
		  {id: 1, title: 'Rotation'},
		  {id: 2, title: 'Manual'},
		  {id: 3, title: 'Override'},
		  {id: 4, title: 'Computed'},
		]

		const shifts = [
		  {id: 1, group: 1, title: 'Sam', start_time: moment(), end_time: moment().add(5, 'hour')},
		  {id: 2, group: 1, title: 'Jo', start_time: moment().add(5, 'hour'), end_time: moment().add(10, 'hour')},
		  {id: 3, group: 1, title: 'Sam', start_time: moment().add(10, 'hour'), end_time: moment().add(15, 'hour')},
		  {id: 4, group: 1, title: 'Jo', start_time: moment().add(15, 'hour'), end_time: moment().add(20, 'hour')},
		  {id: 5, group: 1, title: 'Sam', start_time: moment().add(20, 'hour'), end_time: moment().add(25, 'hour')},
		  {id: 6, group: 2, title: 'Chris', start_time: moment().add(-0.5, 'hour'), end_time: moment().add(4, 'hour')},
		]
		console.log("shifts")
		console.log(shifts)


		return (
			<div className="tab-pane" id={this.props.name} role="tabpanel">
					<Timeline groups={groups}
					style={{position: 'relative', height: '100%'}}
					items={shifts}
					defaultTimeStart={moment().add(-12, 'hour')}
					defaultTimeEnd={moment().add(12, 'hour')}
					lineHeight={100}
					canMove={false}
					/>
			</div>
		)
	}
}

class RotationShifts extends React.Component {
	render() {
		// {JSON.stringify(this.props.shifts)}
		return (
			<tr>
				<td>Rotation</td>
			</tr>
		)
	}
}

class ManualShifts extends React.Component {
	render() {
		// {JSON.stringify(this.props.shifts)}
		return (
			<tr>
				<td>Manual</td>
			</tr>
		)
	}
}
class OverrideShifts extends React.Component {
	render() {
		// {JSON.stringify(this.props.shifts)}
		return (
			<tr>
				<td>Override</td>
			</tr>
		)
	}
}



class SelectTeam extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			teams: null,
			value: props.team,
                        searchTerm: ''
		}
		console.log("value set")
		console.log(this.state.value)
	}

	componentWillMount() {
		axios.get("http://localhost:8080/api/teams/getTeams")
			.then((result) => {
				console.log('got teams')
				console.log(result.data)
                                console.log(result.data[0])
				this.setState({teams: result.data});
			})
			.catch((err) => {
				console.log(err);
			})
	}

    searchUpdated = (term) => {
        this.setState({searchTerm: term})
    }
    search = () => {
        return
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
		return <h3 style={{ paddingTop: '8px' }}><strong>{option.label}</strong></h3>
	}

	render() {
		const mappedAllTeams = this.state.teams ? [{
			label: 'My Teams', 
			options: this.state.teams.map(team => { return {value: team.Name, label: team.Name} })
		}] : [{value: this.props.team, label: this.props.team}]
                const KEYS_TO_FILTER=['Name', 'ID']
                const filteredTeams = this.state.teams ? this.state.teams.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTER)) : ''
                console.log(filteredTeams)
		console.log(mappedAllTeams)
		return (
			<div class="row" style={{verticalAlign: 'text-bottom'}}>                          


				<Select class="col-xs-4" style={{paddingLeft: '0px', height: "50px"}} valueRenderer={this.valueRenderer} clearable={false} value={this.state.value} placeholder={<h3 style={{ paddingTop: '8px' }}><strong>Select Team</strong></h3>} options={mappedAllTeams} onChange={this.handleSelected} />
				<input type="button" class="btn btn-secondary col-xs-4" data-container="body" value="Team Description" data-toggle="popover" data-placement="bottom" data-content="popover text"></input>
				<div class="col-xs-2"></div>
				<CreateTeamModal style={{float: "right"}} class="col-xs-2" />
			</div>
		)
	}
}
				// <div class="col-xs-4"></div>
                // <SearchInput class="col-xs-4" className="search-input" onChange={this.searchUpdated} />
                // <input class="col-xs-2" type="button" value="search" onClick={this.search}> </input>


