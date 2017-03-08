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
import ManualModal from './ManualModal'
import RotationModal from './RotationModal'


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
				<TeamMembers team={this.props.params.team} />
			</div>
		)
	}
}

class TeamMembers extends React.Component {
	constructor() {
		super()
		this.state = {
			allUsers: null,
			users: null,
			disabled: true
		}
	}

	componentDidMount() {
		axios.get('/api/users/getUsers') //get all users
            .then(res => {
                this.setState({
                    allUsers: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })

  		// this.setState({
  		// 	allUsers: []
  		// })

        axios.get('/api/users/getUsers') //needs to be get users on a team
            .then(res => {
                this.setState({
                    users: res.data // get users from database
                })
            })
            .catch(err => {
                console.log(err)
            })
	}

	handleUsersChange = (users) => {
		console.log("handleuserchange")
		const destructedUsers = users.map(user => user.value)
		this.setState({users: destructedUsers})
	}

	containsUser = (users, needle) => {
        for (const user of users) {
            if (user.Username == needle.Username) {
                return true
            }
        }
        return false
    }

    handleUserEditClick = () => {
    	this.setState({
    		disabled: !this.state.disabled
    	})
    }

	render() {

		if (!this.state.allUsers || !this.state.users) {
			return <div></div>
		}

		console.log("allusers")
		console.log(this.state.allUsers)
		console.log("users")
		console.log(this.state.users)

		//filter out users that are already in users
		const mappedUserOptions = this.state.allUsers
			.filter(user => !this.containsUser(this.state.users, user))
			.map(user => {
				return {
					value: {
						Username: user.Username, FirstName: user.FirstName, LastName: user.LastName
					}, 
					label: user.FirstName + " " + user.LastName 
				}})

		// const mappedUserOptions = this.state.allUsers;

		console.log("mappedUserOptions")
		console.log(mappedUserOptions)
			

		const mappedUsers = this.state.users.map(user => {
			return {
				value: {
					Username: user.Username, FirstName: user.FirstName, LastName: user.LastName
				}, 
				label: user.FirstName + " " + user.LastName 
			}})

		return (
				<div class="form-group row pad">
					<Select multi disabled={this.state.disabled} class="col-xs-10" name="user" clearable={false} value={mappedUsers} placeholder="Select User" options={mappedUserOptions} onChange={this.handleUsersChange} />
					<input class="btn" onClick={this.handleUserEditClick} value="Edit Users" />
				</div>
		)
	}
}

class SchedulePane extends React.Component {
	constructor() {
		super()
		this.state = {
			teamID: null,
			schedules: null,
		}
	}

	componentDidMount() {
		//get schedules
		this.getSchedules()
	}

	getSchedules = () => {
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

	handleOverrideUpdate = (parentShift) => {
		axios.post('/api/teams/updateOverrideShift', parentShift)
			.then(res => {
				this.getSchedules()
			})
			.catch(err => {
				console.log("err")
				console.log('failed to update shift')
			})
	}


	handleOverrideDelete = (ID) => {
		axios.post('/api/teams/deleteOverrideShift?ID=' + ID)
			.then(res => {
				console.log('team deleted')
				this.getSchedules()
			})
			.catch(err => {
				console.log(err)
			})
	}

	handleOverrideCreate = (newParentShift) => {
		axios.post('/api/teams/createOverrideShift', newParentShift)
			.then(res => {
				console.log('created team')
				this.getSchedules()
			})
			.catch(err => {
				console.log(err)
			})
	}

	handleManualUpdate = (newParentShift) => {
		axios.post('/api/teams/updateManualShift', newParentShift)
			.then(res => {
				this.getSchedules()
			})
			.catch(err => {
				console.log("err")
				console.log('failed to update manual shift')
			})
	}

	handleManualDelete = (ID) => {
		axios.post('/api/teams/deleteManualShift?ID=' + ID)
			.then(res => {
				console.log('team deleted')
				this.getSchedules()
			})
			.catch(err => {
				console.log(err)
			})
	}

	handleManualCreate = (newParentShift) => {
		axios.post('/api/teams/createManualShift', newParentShift)
			.then(res => {
				console.log('created team')
				this.getSchedules()
			})
			.catch(err => {
				console.log(err)
			})
	}

	handleRotationUpdate = (newParentShift) => {
		axios.post('/api/teams/updateRotationShift', newParentShift)
			.then(res => {
				this.getSchedules()
			})
			.catch(err => {
				console.log("err")
				console.log('failed to update manual shift')
			})
	}

	handleRotationDelete = (ID) => {
		axios.post('/api/teams/deleteRotationShift?ID=' + ID)
			.then(res => {
				console.log('team deleted')
				this.getSchedules()
			})
			.catch(err => {
				console.log(err)
			})
	}

	handleRotationCreate = (newParentShift) => {
		axios.post('/api/teams/createRotationShift', newParentShift)
			.then(res => {
				console.log('created team')
				this.getSchedules()
			})
			.catch(err => {
				console.log(err)
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
				handleOverrideUpdate={this.handleOverrideUpdate}
				handleOverrideDelete={this.handleOverrideDelete}
				handleOverrideCreate={this.handleOverrideCreate}

				handleManualUpdate={this.handleManualUpdate}
				handleManualCreate={this.handleManualCreate}
				handleManualDelete={this.handleManualDelete}

				handleRotationUpdate={this.handleRotationUpdate}
				handleRotationCreate={this.handleRotationCreate}
				handleRotationDelete={this.handleRotationDelete}
				 />
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

			updateOverrideItem: false,
			updateRotationItem: false,
			updateManualItem: false,

			createOverrideItem: false,
			createManualItem: false,
			createRotationItem: false,
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
			updateOverrideItem: false,
			updateRotationItem: false,
			updateManualItem: false,
			clickedID: null,
			clickedParentShift: null,
			createOverrideItem: false,
			createManualItem: false,
			createRotationItem: false
		})
	}

	onItemClick = (itemID, e, d) => {
		console.log("onItemClick")
		console.log(itemID)
		console.log(e)
		// const parentShift = this.state.shifts[itemID].parentShift
		const parentShift = e.currentTarget.props.parentShift
		console.log(parentShift)
		console.log(d);
		this.setState({
			clickedID: itemID,
			clickedParentShift: parentShift,
		})
		
		if (parentShift.Users) { // rotation has users
			console.log("has users so set rotation")
			this.setState({
				updateRotationItem: true
			})
		} else if (parentShift.RepeatType) { // manual has a repeat type
			this.setState({
				updateManualItem: true
			})
		} else if (parentShift) { // override has some data in parent shift
			this.setState({
				updateOverrideItem: true
			})
		}

		this.setState({
			clickedID: itemID,
			clickedParentShift: parentShift,
		})
	}

	onCanvasClick = (groupId, time, e) => {
		console.log("group ID: " + groupId)
		if (groupId == 0) {
			this.setState({
				createRotationItem: true,
				createStart: time
			})
		} else if (groupId ==  1) {
			this.setState({
				createManualItem: true,
				createStart: time
			})
		} else if (groupId == 2) {
			this.setState({
				createOverrideItem: true,
				createStart: time
			})

		} else {

		}
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


		//sort shifts by time?
		// const mappedComputedShifts = shifts2.map((shift, key) => {

		// })


		const groups = [
		  {id: 0, title: <h4><strong>Computed</strong></h4>},
		  {id: 1, title: <h4>Rotation</h4>},
		  {id: 2, title: <h4>Manual</h4>},
		  {id: 3, title: <h4>Override</h4>},
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
					onCanvasClick={this.onCanvasClick}
					/>


					{this.state.updateOverrideItem || this.state.createOverrideItem ? 
						<OverrideModal
							name={this.props.name}
							teamID={this.props.teamID}
							parentShift={this.state.clickedParentShift}
							handleUpdate={this.props.handleOverrideUpdate}
							handleDelete={this.props.handleOverrideDelete}
							handleCreate={this.props.handleOverrideCreate}
							name={this.props.name}
							onModalClose={this.onModalClose}
							createItem={this.state.createOverrideItem}
							updateItem={this.state.updateOverrideItem} 
							createStart={this.state.createStart} />
						: <div></div>
					}
					{this.state.updateManualItem || this.state.createManualItem ? 
						<ManualModal
							name={this.props.name}
							teamID={this.props.teamID}
							parentShift={this.state.clickedParentShift}
							handleUpdate={this.props.handleManualUpdate}
							handleDelete={this.props.handleManualDelete}
							handleCreate={this.props.handleManualCreate}
							name={this.props.name}
							onModalClose={this.onModalClose}
							createItem={this.state.createManualItem}
							updateItem={this.state.updateManualItem} 
							createStart={this.state.createStart} />
						: <div></div>
					}
					{this.state.updateRotationItem || this.state.createRotationItem ? 
						<RotationModal
							name={this.props.name}
							teamID={this.props.teamID}
							parentShift={this.state.clickedParentShift}
							handleUpdate={this.props.handleRotationUpdate}
							handleDelete={this.props.handleRotationDelete}
							handleCreate={this.props.handleRotationCreate}
							name={this.props.name}
							onModalClose={this.onModalClose}
							createItem={this.state.createRotationItem}
							updateItem={this.state.updateRotationItem} 
							createStart={this.state.createStart} />
						: <div></div>
					}
					
			</div>
		)
	}
}
