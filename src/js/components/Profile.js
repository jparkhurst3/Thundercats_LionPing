/* @flow */

import React from 'react'

export default class Profile extends React.Component {
    constructor() {
        super()
        this.state = {
            disabled: true
        }
    }

    render() {
        return (
            <div class="container">
                <div class="row">
                    <div class="col-xs-6">
                        <ProfileInfoCard />
                    </div>
                </div>
            </div>

        )
    }

}

class ProfileInfoCard extends React.Component {
    render() {
        return (
            <div class="card">
                <div class="card-header">
                    <h3>Profile</h3>
                </div>
                <div class="card-block">
                    <span class="card-text"><h5>Name: Sam Ford </h5></span>
                    <span class="card-text"><h5>Username: sford34</h5></span><br></br>

                    <input type="password" class="form-control" id="passw" placeholder="Enter new password" />
                    <button type="submit" class="btn">Change Password</button><br></br><br></br>

                    <input type="text" class="form-control" id="email" placeholder="Enter new email" />
                    <button type="submit" class="btn">Add email</button><br></br><br></br>

                    <input type="text" class="form-control" id="slack" placeholder="Enter new Slack channel" />
                    <button type="submit" class="btn">Add Slack channel</button><br></br><br></br>

                    <input type="text" class="form-control" id="phone" placeholder="Enter new phone number" />
                    <button type="submit" class="btn">Add phone number</button><br></br><br></br>

                    <input type="checkbox" name="notifpref" value="email" checked>  I want to be notified via e-mail.</input><br></br>
                    <input type="checkbox" name="notifpref" value="text">   I want to be notified via text message.</input><br></br>
                    <input type="checkbox" name="notifpref" value="call"> I want to be notified via phone call.</input><br></br>
                    <button type="submit" class="btn">Submit notification settings</button>
                </div>
            </div>
        )
    }
}