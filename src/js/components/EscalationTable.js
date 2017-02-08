import React from 'react'
import { Link } from 'react-router'
import axios from 'axios'
import Select from 'react-select';

export default class EscalationTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            policyID: null,
            layers: null,
            oldLayers: null,
            disabled: true,
            allSchedules: null,
            allUsers: null
        }
    }

    componentDidMount() {
        //get escalation policy for this service
        console.log(this.props.service)
        const apiCall = '/api/services/getEscalationPolicy?Name=' + this.props.service;
        axios.get(apiCall)
            .then(res => {
                console.log('~~~~~res.data~~~~~~')
                console.log(res.data)
                console.log('~~~~~~~~~~~~~~~~~~~')

                const sortedLayers = res.data.Layers.sort((a,b) => a.Level - b.Level)
                console.log('ID::: ', res.data.ID)
                this.setState({
                    policyID: res.data.ID, 
                    layers: sortedLayers,
                    oldLayers: JSON.parse(JSON.stringify(sortedLayers))
                })
            })
            .catch(err => {
                console.log(err);
            })

        //axios get all users
        axios.get('/api/users/getUsers')
            .then(res => {
                this.setState({
                    allUsers: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
        //axios get all teams-schedules
        axios.get('/api/teams/getSchedules')
            .then(res => {
                this.setState({
                    allSchedules: res.data
                })
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    addLayer = () => {
        const layers = this.state.layers;
        //get last level
        const level = this.state.layers.length;
        const newLayer = {
            "Level": level,
            "Delay": 5,
            "Users": [],
            "Schedules": []
        }
        const newLayers = layers.push(newLayer)
        this.setState({
            layers: layers
        })
    }

    deleteLayer = (key) => {
        const filteredLayers = this.state.layers.filter((layer, index) => {
            if (key !== index) {
                return layer
            }
        })
        this.setState({
            layers: filteredLayers
        })
    }

    handleLayerChange = (layer, index) => {
        this.state.layers[index] = layer;
        this.setState({
            layers: this.state.layers
        })
    }

    toggleEdit = (event) => {
        event.preventDefault()
        this.setState({
            disabled: false
        })
    }

    handleCancel = (event) => {
        event.preventDefault()
        console.log("old layers")
        console.log(this.state.oldLayers)
        this.setState({
            layers: JSON.parse(JSON.stringify(this.state.oldLayers)),
            disabled: true
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        console.log("~~~~~~~POLICY ON SUBMIT~~~~~~~~~~")
        //rebuild object
        const policy = {
            ID: this.state.policyID,
            Layers: this.state.layers
        }
        console.log(policy)
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

        axios.post('/api/services/updateEscalationPolicy', policy)
            .then(res => {
                console.log("posted")
            })
            .catch(err => {
                console.log(err)
            })


        //change old layers
        this.setState({
            oldLayers: JSON.parse(JSON.stringify(this.state.layers)),
            disabled: true
        })
    }

    render() {
        const mappedLayers = (this.state.layers && this.state.allSchedules && this.state.allUsers) ? this.state.layers.map((layer, index) => {
            return (
                <EscalationLayer 
                    key={index} 
                    index={index} 
                    disabled={this.state.disabled} 
                    layer={layer} 
                    handleLayerChange={this.handleLayerChange} 
                    deleteLayer={this.deleteLayer} 
                    allUsers={this.state.allUsers}
                    allSchedules={this.state.allSchedules}
                    />
            )
            }
        ) : <tr><td>loading</td></tr>

        const buttons = this.state.disabled ? 
            <input type="button" value="Edit" class="btn" onClick={this.toggleEdit}></input> :
            <div>
                <input type="button" value="Cancel" class="btn" onClick={this.handleCancel}></input>
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
                <table class="table">
                    <thead className="thead-inverse">
                        <tr>
                            <th>Level</th>
                            <th>Delay (Minutes)</th>
                            <th>Users</th>
                            <th>Teams: Schedules</th>
                            {this.state.disabled ? <th></th> : <th>Delete</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {mappedLayers}
                    </tbody>
                </table>
                {this.state.disabled ? <div></div> : <input type="button" value="+" class="btn" onClick={this.addLayer} ></input>}
            </div>
        )
    }
}



    // {this.state.disabled ? <th></th> : <th>Move</th>}


class EscalationLayer extends React.Component {
    constructor(props) {
        super(props)
    }

    containsUser = (users, needle) => {
        for (const user of users) {
            if (user.Username == needle.Username) {
                return true
            }
        }
        return false
    }

    containsSchedule = (schedules, needle) => {
        for (const schedule of schedules) {
            if (schedule.TeamID == needle.TeamId && schedule.ScheduleName == needle.ScheduleName) {
                return true
            }
        }
        return false
    }

    handleDelayChange = (event) => {
        const layer = this.props.layer
        layer.Delay = event.target.value
        this.props.handleLayerChange(layer, this.props.index)
    }

    handleUsersChange = (users) => {
        const destructedUsers = users.map(user => user.value)
        const layer = this.props.layer
        layer.Users = destructedUsers;
        this.props.handleLayerChange(layer, this.props.index)
    }

    handleSchedulesChange = (schedules) => {
        const destructedSchedules = schedules.map(schedule => schedule.value)
        const layer = this.props.layer
        layer.Schedules = destructedSchedules
        this.props.handleLayerChange(layer, this.props.index)
    }

    render() {
        //map and filter all to build to react-select specifications
        const mappedSchedules = this.props.layer.Schedules.map(schedule => {return {value: schedule, label: schedule.TeamName + ": " + schedule.ScheduleName}})
        const mappedAllSchedules = this.props.allSchedules
            .filter((schedule) => !this.containsSchedule(this.props.layer.Schedules, schedule))
            .map((schedule) => { return {value: schedule, label: schedule.TeamName + ": " + schedule.ScheduleName}})

        const mappedUsers = this.props.layer.Users.map(user => {return {value: user, label: user.FirstName + " " + user.LastName}})
        const mappedAllUsers = this.props.allUsers
            .filter((user) => !this.containsUser(this.props.layer.Users, user))
            .map((user) => { return {value: user, label: user.FirstName + " " + user.LastName}})

        return (
            <tr>
                <td>{this.props.index}</td>
                <td><input class="form-control" type="number" value={this.props.layer.Delay} disabled={this.props.disabled} onChange={this.handleDelayChange} /></td>
                <td><Select disabled={this.props.disabled} multi value={mappedUsers} options={mappedAllUsers} onChange={this.handleUsersChange} /></td>
                <td><Select disabled={this.props.disabled} multi value={mappedSchedules} options={mappedAllSchedules} onChange={this.handleSchedulesChange} /></td>
                {this.props.disabled ? <td></td> : <td>
                    <p className="changeArrow" value={this.props.index} onClick={() => this.props.deleteLayer(this.props.index)} >&#10060;</p>
                </td>}
            </tr>
        )
    }
}

// {this.props.disabled ? <td></td> : <td>
//                     <p onClick={() => this.props.movePolicyUp(level)} className="changeArrow" value={level}>&#9650;</p>
//                     <p onClick={() => this.props.movePolicyDown(level)} className="changeArrow" value={level}>&#9660;</p>

//                 </td>}

// onClick={() => this.props.movePolicyUp(this.props.layer)}

// <td><Select multi value={this.state.teams} options={this.state.teams} onChange={this.handleSelected} /></td>

// {
//     "ID":"1",
//     "Layers":[
//         {
//             "Level":2,
//             "Delay":10,
//             "Users":[
//                 {"Username":"hkim","FirstName":"Ho Keun","LastName":"Kim"}
//             ],
//             "Schedules":[
//                 {"TeamID":1,"TeamName":"Database Team","ScheduleName":"Default"}
//             ]
//         },








