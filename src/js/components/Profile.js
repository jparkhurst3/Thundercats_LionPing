/* @flow */

import React from 'react'

import NotificationCard from './Home/NotificationCard'
import axios from 'axios'

export default class Profile extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    this.getUser()
  }

  getUser = () => {
    axios.get("api/users/getUser?Username=" + "sford")
      .then(res => {
        console.log(res);
        this.setState({...res.data})
      })
      .catch(err => {
        console.log(err)
      })
  }

  submitChanges = (user) => {
    console.log("submitUser")
    console.log(user)
    axios.post("/api/users/updateUserNotificationPreferences", {
      "Username":user.Username,
      "Email":user.Email,
      "Phone":user.Phone,
      "NotifyEmail":user.NotifyEmail,
      "NotifyText":user.NotifyText,
      "NotifyCall":user.NotifyCall
    })
    .then(res => {
      console.log("posted")
      this.getUser()
    })
  }
  render() {
    if (!this.state) {
      return <h1>asdf</h1>
    }
    const props = {...this.state};
    console.log(props)
    return (
          <div class="container">
              <div class="row">
                  <div class="col-xs-6">
                      <ProfileInfoCard {...props} />
                      <PingSettings {...props} submitChanges={this.submitChanges} />
                  </div>
                  <div class="col-xs-6">
                      <NotificationCard />
                  </div>
              </div>
          </div>
      )
  }
}


class ProfileInfoCard extends React.Component {
    render() {
        return (
            <div class="card home-card">
                <div class="card-header home-card-header">
                    <h3>Profile</h3>
                </div>
                <div class="card-block">
                    <span class="card-text"><h5>Name: {this.props.FirstName + " " + this.props.LastName}</h5></span>
                    <span class="card-text"><h5>Username: {this.props.Username}</h5></span>
                </div>
              </div>
        )
      }
}

class PingSettings extends React.Component {
  constructor(props) {
    super(props)
    console.log("props")
    console.log(props)
    this.state = {
      Username:this.props.Username,
      Email: this.props.Email,
      Phone: this.props.Phone,
      NotifyEmail: this.props.NotifyEmail == 1 ? true : false,
      NotifyText: this.props.NotifyText == 1 ? true : false,
      NotifyCall: this.props.NotifyCall == 1 ? true : false,
      disabled: true,
    }
  }

  handleChange = (event) => {
    console.log(event);
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  submitChanges = (e) => {
    const user = {...this.state}
    this.props.submitChanges(user)
    this.toggleDisabled()
  }

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled
    })
  }


	render() {
    const buttons = this.state.disabled ?
      <div>
        <input type="button" name="disabled" style={{width: "30%", float:"left"}} name="disabled" class="btn" value="Edit" onClick={this.toggleDisabled} />
      </div> :
      <div>
        <input class="btn" type="button" name="disabled" style={{width: "30%", float:"left"}} value="Cancel" onClick={this.toggleDisabled} />
        <input class="btn" type="button" style={{width: "30%", float:"right"}} value="Submit" onClick={this.submitChanges} />
      </div>



		return (
			<div class="card home-card">
				<div class="card-header home-card-header">
					<h3>Ping Settings</h3>
				</div>
				<div class="card-block">
          <h4 style={{textAlign:"left"}}>Email</h4>
          <div class="row">
            <div class="col-xs-12">
              <input class="form-control" type="email" disabled={this.state.disabled} name="Email" value={this.state.Email} onChange={this.handleChange}  />
            </div>
          </div>

          <h4 style={{textAlign:"left"}}>Phone</h4>
          <div class="row">
            <div class="col-xs-12">
              <input class="form-control" type="phone" disabled={this.state.disabled} name="Phone" value={this.state.Phone} onChange={this.handleChange}  />
            </div>
          </div>

          <div>
            <h4 style={{textAlign: "left"}}>Notification Options</h4>
            <div class="form-check form-check-inline">
              <label class="form-check-label">
                <input disabled={this.state.disabled} class="form-check-input" type="checkbox" name="NotifyEmail" value={this.state.NotifyEmail} checked={this.state.NotifyEmail} onChange={this.handleChange} />Email
              </label>
            </div>
            <div class="form-check form-check-inline">
              <label class="form-check-label">
                <input disabled={this.state.disabled} class="form-check-input" type="checkbox" name="NotifyText" value={this.state.NotifyText} checked={this.state.NotifyText} onChange={this.handleChange} />Text
              </label>
            </div>
            <div class="form-check form-check-inline">
              <label class="form-check-label">
                <input disabled={this.state.disabled} class="form-check-input" type="checkbox" name="NotifyCall" value={this.state.NotifyCall} checked={this.state.NotifyCall} onChange={this.handleChange} />Call
              </label>
            </div>
          </div>
          <div>
            {buttons}
          </div>
        </div>
			</div>
		)
	}
}
