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
		const mappedData = this.state.schedules.map((schedule, key) => 
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
					"Timestamp":"2017-02-20T22:02:01.000Z",
					"Duration":60,
					"Username":"cclegg"
				}
			],
			"ManualShifts":[
				{
					"ID":1,
					"Timestamp":"2017-02-20T22:02:01.000Z",
					"Duration":180,
					"Username":"cclegg",
					"Repeated":true,
					"RepeatType":"daily"
				}
			],
			"RotationShifts":[
				{
					"ID":1,
					"Timestamp":"2017-02-20T22:02:01.000Z",
					"Duration":120,
					"Repeated":true,
					"RepeatType":"weekly",
					"Users":[
						{
							"Username":"cclegg",
							"Position":1
						},{
							"Username":"zhancock",
							"Position":2
						}
					]
				}
			]
		},{
			"ScheduleName":"Test",
			"OverrideShifts":[],
			"ManualShifts":[],
			"RotationShifts":[]
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

	formatManualShift = (shift) => {
		let adder = ""
		if (shift.RepeatType == "daily") {
			adder = "days"
		}


		if (shift.Repeated) {
			return [...Array(5)].map((num, key) => {
				console.log("num: " + key)
				console.log("adder: " + adder)
				const start = moment(shift.Timestamp).add(key, adder)
				console.log("start")
				console.log(start)
				return {
					id: key+10,
					group: 2, 
					title: shift.Username, 
					start_time: moment(shift.Timestamp).add(key, adder), 
					end_time: moment(shift.Timestamp).add(key, adder).add(shift.Duration, 'minutes')
				}
			})
		}
	}


	render() {
		console.log(this.props.schedule)
		const overrideShifts = this.props.schedule.OverrideShifts;
		const manualShifts = this.props.schedule.ManualShifts;
		const rotationShifts = this.props.schedule.RotationShifts;

		const mappedOverrideShifts = overrideShifts.map((shift, key) => {
			return {
				id: shift.ID,
				group: 3, 
				title: shift.Username, 
				start_time: moment(shift.Timestamp), 
				end_time: moment(shift.Timestamp).add(shift.Duration, 'minutes')
			}
		})

		const mappedManualShifts = manualShifts.map((shift, key) => {
			return this.formatManualShift(shift)
		})

		console.log("mappedManualShifts")
		console.log(mappedManualShifts)
		let shifts = []
		if (this.props.name == "Default") {
			shifts = [...mappedOverrideShifts, ...mappedManualShifts[0]]
		}
		console.log("shifts")
		console.log(shifts)

		const groups = [
		  {id: 1, title: 'Rotation'},
		  {id: 2, title: 'Manual'},
		  {id: 3, title: 'Override'},
		  {id: 4, title: 'Computed'},
		]

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


