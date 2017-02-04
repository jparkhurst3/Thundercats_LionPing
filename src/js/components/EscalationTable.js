import React from 'react'
import { Link } from 'react-router'
import axios from 'axios'
import Select from 'react-select';

export default class EscalationTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            layers: null,
            disabled: true,
            buttonName: 'Edit'
        }
    }

    componentDidMount() {
        const apiCall = 'http://localhost:8080/api/services/getEscalationPolicyByID?ID=' + this.props.serviceID;
        axios.get(apiCall)
            .then(res => {
                this.setState({
                    layers: res.data.Layers.sort((a,b) => a.Level - b.Level)
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    toggleEdit = (event) => {
        event.preventDefault()
        console.log('toggle')
        this.setState({
            disabled: !this.state.disabled,
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()

    }

    render() {
        const mappedLayers = this.state.layers ? this.state.layers.map((layer, index) => {
            console.log('index:' + index)
            const level = layer.Level;
            const delay = layer.Delay;
            const users = layer.Users;
            const schedules = layer.Schedules;
            return (
                <EscalationLayer disabled={this.state.disabled} level={index} delay={delay} users={users} schedules={schedules} />
            )
            }
        ) : <tr><td>loading</td></tr>

        const buttons = this.state.disabled ? 
            <input type="button" value="Edit" class="btn" onClick={this.toggleEdit}></input> :
            <div>
                <input type="button" value="Cancel" class="btn" onClick={this.toggleEdit}></input>
                <input type="button" value="Submit Changes" class="btn" onClick={this.handleSubmit}></input>
            </div>


        return (
            <div>
                <div className="row">
                    <div className="col-xs-3">
                        <h3>Escalation Policy</h3>
                    </div>
                    <div className="col-xs-9">
                        {buttons}
                    </div>
                </div>
                <table class="table table-hover">
                    <thead className="thead-inverse">
                        <tr>
                            {this.state.disabled ? <div></div> : <th>Move</th>}
                            <th>Level</th>
                            <th>Delay</th>
                            <th>Users</th>
                            <th>Teams :: Schedules</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappedLayers}
                    </tbody>
                </table>
            </div>
        )
    }
}

class EscalationLayer extends React.Component {
    constructor(props) {
        super(props)
        const teams = this.props.schedules.map(schedule => { return {value: schedule.TeamName, label: schedule.TeamName}}) 
        const users = this.props.users.map(user => {return {value: user.Username, label: user.Username}})
        this.state = {
            delay: this.props.delay,
            currentTeams: teams,
            teamOptions: teams,
            currentUsers: users,
            userOptions: users
        }
    }

    handleDelayChange = (event) => {
        this.setState({
            delay: event.target.value
        })
    }

    handleSelectedUser = (users) => {
        console.log('user:::')
        console.log(users);
        this.setState({currentUsers: users});
    }

    handleSelectedTeam = (teams) => {
        this.setState({currentTeams: teams})
    }

    handleSubmit = (event) => {
        //submit escalation policy
    }

    render() {
        console.log("delay: " + this.state.delay)
        const mappedUsers = this.props.users.map(user => 
            <li><Link to={`/users/${user.Username}`}>{user.Username}</Link></li>
        )
        const mappedSchedules = this.props.schedules.map(schedule => 
            <li><Link to={`/teams/${schedule.TeamName}`}>{schedule.TeamName} :: {schedule.ScheduleName}</Link></li>
        )

        //         if (this.state.props.disabled) {
        //     return (
        //         <tr>
        //             <td>{this.props.level}</td>
        //             <td><form class="form-inline"><label><input class="form-control" type="number" value={this.state.delay} disabled={this.props.disabled} onChange={this.handleDelayChange} />Minutes</label></form></td>
        //             <td><Select disabled={this.props.disabled} multi value={this.state.currentUsers} options={this.state.userOptions} onChange={this.handleSelectedUser} /></td>
        //             <td><Select disabled={this.props.disabled} multi value={this.state.currentTeams} options={this.state.teamOptions} onChange={this.handleSelectedTeam} /></td>
        //         </tr>
        //     )
        // }


        return (
            <tr>
                {this.props.disabled ? <div></div> : <td>
                    <p className="changeArrow">&#9650;</p>
                    <p className="changeArrow">&#9660;</p>
                </td>}
                <td>{this.props.level}</td>
                <td><form class="form-inline"><label><input class="form-control" type="number" value={this.state.delay} disabled={this.props.disabled} onChange={this.handleDelayChange} />Minutes</label></form></td>
                <td><Select disabled={this.props.disabled} multi value={this.state.currentUsers} options={this.state.userOptions} onChange={this.handleSelectedUser} /></td>
                <td><Select disabled={this.props.disabled} multi value={this.state.currentTeams} options={this.state.teamOptions} onChange={this.handleSelectedTeam} /></td>
            </tr>
        )
    }
}

// <td><Select multi value={this.state.teams} options={this.state.teams} onChange={this.handleSelected} /></td>

// {"ID":"1",
// "Layers":[{"Level":2,"Delay":10,"Users":[{"Username":"hkim","FirstName":"Ho Keun","LastName":"Kim"}],"Schedules":[{"TeamID":1,"TeamName":"Database Team","ScheduleName":"Default"}]},{"Level":1,"Delay":0,"Users":[{"Username":"cclegg","FirstName":"Chris","LastName":"Clegg"},{"Username":"sford","FirstName":"Sam","LastName":"Ford"}],"Schedules":[]}]}








