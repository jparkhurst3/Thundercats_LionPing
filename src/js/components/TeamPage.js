import React from 'react';
import axios from 'axios'
import CreateTeamModal from './CreateTeamModal'
import Select from 'react-select-plus'
import {Link, browserHistory, withRouter} from 'react-router'
import SearchInput, {createFilter} from 'react-search-input'
import "babel-polyfill";

import Timeline from 'react-calendar-timeline'
import moment from 'moment'
import SelectTeam from './SelectTeam'
import OverrideModal from './OverrideModal'


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
			teamID: null,
			editDisabled: true,
			schedules: null,
            searchTerm: '',
            searchTags: ['']
		}
	}

	componentDidMount() {
		//get schedules
		axios.get('/api/teams/getSchedulesForTeam?Name=' + this.props.team)
			.then(res => {
				this.setState({
					teamID: res.data.TeamID,
					schedules: res.data.Schedules,
				})
			})
			.catch(err => {
				console.log(err)
			})
	}

	handleOverrideUpdate = (parentShift, scheduleName) => {
		axios.post('/api/teams/updateOverrideShift', parentShift)
			.then(res => {
				console.log(res)
				console.log("succses")
				const schedules = this.state.schedules;
				console.log('schedules')
				console.log(this.state.schedules)

				const correctScheduleIndex = schedules.findIndex(schedule => schedule.ScheduleName == scheduleName)
				console.log(correctScheduleIndex)
				const correctShiftIndex = schedules[correctScheduleIndex].OverrideShifts.findIndex(shift => shift.ID == parentShift.ID)
				console.log(correctShiftIndex)


				//update schedules
				schedules[correctScheduleIndex].OverrideShifts[correctShiftIndex] = parentShift
				console.log("updatedSchedule")
				console.log(schedules)
				this.setState({
					schedules: schedules,
				})

			})
			.catch(err => {
				console.log("err")
				console.log('failed to update shift')
			})
	}


	render() {
		if (!this.state.schedules) {
			return <div></div>
		}

		const mappedTabs = this.state.schedules.map((schedule, key) =>
			<ScheduleTab active={key == 1} name={schedule.ScheduleName} handleScheduleChange={this.handleScheduleChange} />
		)
		const mappedData = this.state.schedules.map((schedule, key) => 
			<ScheduleData 
				name={schedule.ScheduleName} 
				teamID={this.state.teamID}
				schedule={schedule} 
				handleOverrideUpdate={this.handleOverrideUpdate} />
		)

		return (
			<div style={{paddingTop: '20px'}}>
				<h3>Schedules</h3>
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

class ScheduleData extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			clickedID: null,
			clickedParentShift: null,
		}
	}

	formatOverrideShift = (shift) => {
		return {
			id: null,
			group: 3,
			title: shift.Username, 
			start_time: moment(shift.Timestamp), 
			end_time: moment(shift.Timestamp).add(shift.Duration, 'minutes'),
			itemProps: {
				parentShift: shift
			}
		}
	}

	//takes in a shift from the database and converts it to the correct format
	formatManualShift = (shift) => {
		const num = shift.Repeated ? 50 : 1
		let adder = ""
		if (shift.RepeatType == "daily") {
			adder = "days"
		} else if (shift.RepeatType == "weekly") {
			adder = "weeks"
		} else if (shift.RepeatType == "monthly") {
			adder = "months"
		}
		return [...Array(num)].map((_, key) => {
			return {
				id: null,
				group: 2, 
				title: shift.Username, 
				start_time: moment(shift.Timestamp).add(key, adder), 
				end_time: moment(shift.Timestamp).add(key, adder).add(shift.Duration, 'minutes'),
				itemProps: {
					parentShift: shift
				}
			}
		})
	}

	formatRotationShift = (shift) => {
		const num = shift.Repeated ? 50 : 1
		let adder = ""
		if (shift.RepeatType == "daily") {
			adder = "days"
		} else if (shift.RepeatType == "weekly") {
			adder = "weeks"
		} else if (shift.RepeatType == "monthly") {
			adder = "months"
		}
		return [...Array(num)].map((_, key) => {
			return {
				id: null,
				group: 1,
				title: shift.Users[key % shift.Users.length].Username, //rotates through users
				start_time: moment(shift.Timestamp).add(key, adder), 
				end_time: moment(shift.Timestamp).add(key, adder).add(shift.Duration, 'minutes'),
				itemProps: {
					parentShift: shift
				}
			}
		})
	}

	onModalClose = () => {
		console.log("close modal")
		this.setState({
			clickedID: null,
			clickedParentShift: null
		})
	}

	onItemClick = (itemID, e) => {
		console.log("onItemClick")
		console.log(itemID)
		console.log(e)
		// const parentShift = this.state.shifts[itemID].parentShift
		const parentShift = e.currentTarget.props.parentShift
		console.log(parentShift)
		this.setState({
			clickedID: itemID,
			clickedParentShift: parentShift
		})
	}

	render() {
		const mappedOverrideShifts = this.props.schedule.OverrideShifts.map((shift, key) => {
			return this.formatOverrideShift(shift)
		})

		//returns [[shift1 repeated],[shift2 repeated],...]
		const mappedManualShifts = this.props.schedule.ManualShifts.map((shift, key) => {
			return this.formatManualShift(shift)
		})

		//returns [[shift1 repeated],[shift2 repeated],...]
		const mappedRotationShifts = this.props.schedule.RotationShifts.map((shift, key) => {
			return this.formatRotationShift(shift)
		})
		//aggregate from nested arrays
		let shifts = [...mappedOverrideShifts]
		for (const shift of mappedManualShifts) {
			shifts.push(...shift)
		}
		for (const shift of mappedRotationShifts) {
			shifts.push(...shift)
		}

		//give all shifts ids
		const shifts2 = shifts.map((shift, key) => {
			shift.id = key+1;
			return shift
		})

		const groups = [
		  {id: 1, title: <h4>Rotation</h4>},
		  {id: 2, title: <h4>Manual</h4>},
		  {id: 3, title: <h4>Override</h4>},
		  {id: 4, title: <h4><strong>Computed</strong></h4>},
		]

		return (
			<div className="tab-pane" id={this.props.name} role="tabpanel">
					<Timeline groups={groups}
					style={{position: 'relative', height: '100%'}}
					items={shifts2}
					defaultTimeStart={moment().add(-8, 'hour')}
					defaultTimeEnd={moment().add(8, 'hour')}
					lineHeight={50}
					canMove={false}
					canZoom={true}
					stackItems={false}
					onItemClick={this.onItemClick}
					/>


					{this.state.clickedID ? 
						<OverrideModal
							name={this.props.name}
							teamID={this.props.teamID}
							parentShift={this.state.clickedParentShift}
							handleOverrideUpdate={this.props.handleOverrideUpdate}
							name={this.props.name}
							onModalClose={this.onModalClose}
							 />
						: <div></div>
					} 
					
			</div>
		)
	}
}

// {this.state.clickedID ? 
// 						<UpdateOverride 
// 							name={this.props.name}
// 							teamID={this.props.teamID}
// 							parentShift={this.state.clickedParentShift}
// 							handleOverrideUpdate={this.props.handleOverrideUpdate}
// 							name={this.props.name} />
// 						: <div></div>
// 					}

