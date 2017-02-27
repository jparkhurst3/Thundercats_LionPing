import React from 'react';
import ReactModal from 'react-modal'
import {Link} from 'react-router'
import axios from 'axios'
import moment from 'moment'
import "babel-polyfill";
import Select from 'react-select-plus'



export default class OverrideModal extends React.Component {      
  render () {
	return (
		<div>
			<ReactModal 
				isOpen={this.props.updateItem || this.props.createItem}
				contentLabel="Minimal Modal Example" 
				onRequestClose={this.props.onModalClose}
        		shouldCloseOnOverlayClick={true}
				style={{
					overlay: {
						background: 'rgba(255, 255, 255, .9)'
					},
					content: {
						position: 'absolute',
						height: '400px',
						width: '500px',
						left: '50%',
						top: '50%',
						transform: 'translate(-50%, -50%)',
						right: 'auto',
						bottom: 'auto',
						zIndex: '100',
						padding: 'none',
						border: 'none'
					}
				}} >
				<OverrideCard {...this.props} />
			</ReactModal>
		</div>
	);
  }
}

class OverrideCard extends React.Component {
	constructor(props) {
		super(props)
		if (this.props.createItem) {
			this.state = {
				allUsers: null,
				user: null,
				start: moment(props.createStart).format('YYYY-MM-DDTHH:mm'),
				end: moment(props.createStart).add(60, 'minutes').format('YYYY-MM-DDTHH:mm'),
			}
			console.log('override card start time')
			console.log(this.state.start)
		} else if (this.props.updateItem) {
			this.state = {
				allUsers: null,
				user: {value: {Username: this.props.parentShift.Username, FirstName: this.props.parentShift.FirstName, LastName: this.props.parentShift.LastName}, label: props.parentShift.FirstName + " " + props.parentShift.LastName},
				start: moment(props.parentShift.Timestamp).format('YYYY-MM-DDTHH:mm'),
				end: moment(props.parentShift.Timestamp).add(props.parentShift.Duration, 'minutes').format('YYYY-MM-DDTHH:mm'),
			}
		}
	}

	componentDidMount() {
        axios.get('/api/users/getUsers') //needs to be get users on a team
            .then(res => {
                this.setState({
                    allUsers: res.data // get users from database
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleUpdate = () => {
    	//rebuild a parentShift
    	console.log("handle Submit")
    	const newParentShift = {
    		ID: this.props.parentShift.ID,
			TeamID : this.props.teamID,
			ScheduleName : this.props.name,
			Timestamp: moment(this.state.start).format(),
			Duration: moment.duration(moment(this.state.end).diff(moment(this.state.start))).asMinutes(),
			Username: this.state.user.value.Username
    	}
    	console.log("newParentShift")
    	console.log(newParentShift)
    	this.props.handleOverrideUpdate(newParentShift)
    	this.props.onModalClose()
    }

    handleDelete = () => {
    	console.log('handle Delete')
    	this.props.handleOverrideDelete(this.props.parentShift.ID)
    	this.props.onModalClose()
    }

    handleCreate = () => {
    	console.log('handle Create')
    	const newParentShift = {
			TeamID : this.props.teamID,
			ScheduleName : this.props.name,
			Timestamp: moment(this.state.start).format(),
			Duration: moment.duration(moment(this.state.end).diff(moment(this.state.start))).asMinutes(),
			Username: this.state.user.value.Username
    	}

    	this.props.handleOverrideCreate(newParentShift)
    	this.props.onModalClose()
    }

    handleChange = (event) => {
	    this.setState({
	    	[event.target.name]: event.target.value
	    });
	}

	handleUserChange = (user) => {
		console.log("handleuserchange")
		this.setState({user: user})
	}

	render() {
		if (!this.state.allUsers) {
			return <div></div>
		}

		const mappedAllUsers = this.state.allUsers.map(user => {return {value: user, label: user.FirstName + " " + user.LastName}}) // map users names'
		
		return (
			<div class="card">
				<div class="card-header"><h3>Edit Override</h3></div>
				<div class="card-block">
					<form>
						<div class="form-group row">
							<div class="col-xs-10">
								<input class="form-control" name="start" placeholder="Start Date and Time" type="datetime-local" onChange={this.handleChange} value={this.state.start} id="example-datetime-local-input"></input>
							</div>
						</div>
						<div class="form-group row">
							<div class="col-xs-10">
								<input class="form-control" name="end" placeholder="End Date and Time" type="datetime-local" onChange={this.handleChange} value={this.state.end} id="example-datetime-local-input"></input>
							</div>
						</div>
						<div class="form-group row">
							<Select class="col-xs-10" name="user" clearable={false} value={this.state.user} placeholder="Select User" options={mappedAllUsers} onChange={this.handleUserChange} />
						</div>
						<div class="form-group row">
							{this.props.updateItem ? 
								<div class="col-xs-10" style={{display: 'inline'}}>
		                			<input type="button" value="Update Shift" class="btn" onClick={this.handleUpdate}></input>
		                			<input type="button" value="Delete Shift" class="btn" onClick={this.handleDelete}></input>
								</div>
								:
								<div class="col-xs-10" style={{display: 'inline'}}>
		                			<input type="button" value="Create Shift" class="btn" onClick={this.handleCreate}></input>
								</div>
							}
						</div>
					</form>
				</div>
			</div>
		  )
	}
}