import React from 'react';
import ReactModal from 'react-modal'
import {Link} from 'react-router'
import axios from 'axios'
import moment from 'moment'
import "babel-polyfill";
import Select from 'react-select-plus'



export default class ManualModal extends React.Component {
  render () {
	return (
		<div>
			<ReactModal
				isOpen={this.props.updateItem || this.props.createItem}
				contentLabel="Minimal Modal Example"
				onRequestClose={this.props.onModalClose}
        		shouldCloseOnOverlayClick={true}
            style = {{
                overlay: {
                    background: 'rgba(255, 255, 255, 0.9)',
                    zIndex:"1000"
                },
                content: {
                  textAlign:"center",
                  position: 'absolute',
                  height: 'auto',
                  width: '500px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  right: 'auto',
                  bottom: 'auto',
                  zIndex: '1000',
                  padding: 'none',
                  border: 'none',
                  boxShadow: "0px 0px 20px #888888",
                  borderRadius: "2px",
                  border:"none"
                }
            }} >
				<ManualCard {...this.props} />
			</ReactModal>
		</div>
	);
  }
}

class ManualCard extends React.Component {
	constructor(props) {
		super(props)
		console.log("repeated")
		if (this.props.createItem) {
			this.state = {
				allUsers: null,
				user: null,
				start: moment(props.createStart).format('YYYY-MM-DDTHH:mm'),
				end: moment(props.createStart).add(60, 'minutes').format('YYYY-MM-DDTHH:mm'),
				repeated: true,
				repeatType: "daily"
			}
			console.log('override card start time')
			console.log(this.state.start)

		} else if (this.props.updateItem) {
			this.state = {
				allUsers: null,
				user: {value: {Username: this.props.parentShift.Username, FirstName: this.props.parentShift.FirstName, LastName: this.props.parentShift.LastName}, label: props.parentShift.FirstName + " " + props.parentShift.LastName},
				start: moment(props.parentShift.Timestamp).format('YYYY-MM-DDTHH:mm'),
				end: moment(props.parentShift.Timestamp).add(props.parentShift.Duration, 'minutes').format('YYYY-MM-DDTHH:mm'),
				repeated: props.parentShift.Repeated,
				repeatType: props.parentShift.RepeatType
			}
		}
	}

	componentDidMount() {
    axios.get('/api/teams/getUsersOnTeam', {
        params: {
          Name: this.props.team
        }
      })
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
    	console.log("handle Submit manual")
    	const newParentShift = {
    		ID: this.props.parentShift.ID,
  			TeamID : this.props.teamID,
  			ScheduleName : this.props.name,
  			Timestamp: moment(this.state.start).utc().format(),
  			Duration: moment.duration(moment(this.state.end).diff(moment(this.state.start))).asMinutes(),
  			Username: this.state.user.value.Username,
  			Repeated: this.state.repeated,
  			RepeatType: this.state.repeatType
    	}
    	console.log("newParentShift")
    	console.log(newParentShift)
    	this.props.handleUpdate(newParentShift)
    	this.props.onModalClose()
    }

    handleDelete = () => {
    	console.log('handle Delete manual')
    	this.props.handleDelete(this.props.parentShift.ID)
    	this.props.onModalClose()
    }

    handleCreate = () => {
    	console.log('handle Create manual')
    	const newParentShift = {
  			TeamID : this.props.teamID,
  			ScheduleName : this.props.name,
  			Timestamp: moment(this.state.start).utc().format(),
  			Duration: moment.duration(moment(this.state.end).diff(moment(this.state.start))).asMinutes(),
  			Username: this.state.user.value.Username,
  			Repeated: this.state.repeated,
  			RepeatType: this.state.repeatType
    	}
      console.log("create new parent shift to submit")
      console.log(newParentShift)
      console.log("this.state.start")
      console.log(this.state.start)

    	this.props.handleCreate(newParentShift)
    	this.props.onModalClose()
    }

    handleChange = (event) => {
  		const target = event.target;
      const value = target.type === 'radio' ? target.checked : target.value;
  		const name = target.name;
	    this.setState({
	    	[name]: value
	    });
	  }

	handleRepeatedChange = (event) => {
    console.log(event)
		this.setState({
			repeated: false,
      repeatType: ''
		})
	}

	handleRepeatTypeChange = (d) => {
		console.log("handle repeattype change");
		this.setState({
			repeatType: d,
      repeated: true
		})
		console.log(this.state.repeatType)
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
			<div class="card modal-card">
				<div class="card-header home-card-header"><h3>Edit Manual</h3></div>
				<div class="card-block modal-card-block">
					<form>
						<div class="form-group">
							<input class="form-control" name="start" placeholder="Start Date and Time" type="datetime-local" onChange={this.handleChange} value={this.state.start}></input>
						</div>
						<div class="form-group">
								<input class="form-control" name="end" placeholder="End Date and Time" type="datetime-local" onChange={this.handleChange} value={this.state.end}></input>
						</div>
						<div class="form-group">
							<Select name="user" clearable={false} value={this.state.user} placeholder="Select User" options={mappedAllUsers} onChange={this.handleUserChange} />
						</div>

						<div class="form-group">
              <h4 style={{textAlign: "left", float:"left"}}>Repeated</h4>
              <div class="form-check form-check-inline">
                <label class="form-check-label">
                  <input class="form-check-input" type="radio" name="noRepeat" value={!this.state.repeated} checked={!this.state.repeated} onChange={this.handleRepeatedChange} />None
                </label>
              </div>
              <div class="form-check form-check-inline">
                <label class="form-check-label">
                  <input class="form-check-input" type="radio" name="daily" checked={this.state.repeatType == "daily"} onChange={() => this.handleRepeatTypeChange("daily")} />Daily
                </label>
              </div>
              <div class="form-check form-check-inline">
                <label class="form-check-label">
                  <input class="form-check-input" type="radio" name="weekly" checked={this.state.repeatType == "weekly"} onChange={() => this.handleRepeatTypeChange('weekly')} />Weekly
                </label>
              </div>
						</div>

						<div class="form-group">
							{this.props.updateItem ?
								<div class="" style={{display: 'inline'}}>
            			<input type="button" value="Update Shift" class="btn" onClick={this.handleUpdate}></input>
            			<input type="button" value="Delete Shift" class="btn" onClick={this.handleDelete}></input>
								</div>
								:
								<div class="" style={{display: 'inline'}}>
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
