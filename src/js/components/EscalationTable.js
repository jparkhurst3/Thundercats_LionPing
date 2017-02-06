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

        //axios get all users

        //axios get all teams-schedules

    }

    editLayers = (data) => {
        this.setState({
            layers: {...layers, data}
        })
    }

    addLayer = () => {
        console.log('add layer')
        const layers = this.state.layers;
        console.log(layers)
        const newLayer = {
            "Level": 3,
            "Delay": 5,
            "Users": [],
            "Schedules": []
        }
        console.log('layer added')
        const newLayers = layers.push(newLayer)
        console.log(layers);
        console.log('newlayers')
        console.log(newLayers)
        this.setState({
            layers: layers
        })
        console.log(this.state.layers)

    }

    deleteLayer = (key) => {
        console.log(this.state.layers)
        const filteredLayers = this.state.layers.filter((layer, index) => {
            if (key !== index) {
                return layer
            }
        })
        this.setState({
            layers: filteredLayers
        })
        console.log(this.state.layers)
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
        console.log("Submit table")
    }

    render() {
        console.log("layers")
        console.log(this.state.layers)
        const mappedLayers = this.state.layers ? this.state.layers.map((layer, index) => {
            console.log(index)
            return (
                <EscalationLayer key={index} index={index} disabled={this.state.disabled} layers={this.state.layers} editLayers={this.editLayers} deleteLayer={this.deleteLayer} />
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
                <table class="table">
                    <thead className="thead-inverse">
                        <tr>
                            <th>Level</th>
                            <th>Delay (Minutes)</th>
                            <th>Users</th>
                            <th>Teams :: Schedules</th>
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
        const index = this.props.index
        console.log('this.props.layers')
        console.log('index: '+ this.props.index)
        console.log(this.props.layers[this.props.index])
        const teams = this.props.layers[index].Schedules.map(schedule => { return {value: schedule.TeamName, label: schedule.TeamName}}) 
        const users = this.props.layers[index].Users.map(user => {return {value: user.Username, label: user.Username}})
        this.state = {
            key: this.props.key,
            layers: this.props.layers,
            currentTeams: teams,
            teamOptions: teams,
            currentUsers: users,
            userOptions: users
        }
    }

    handleDelayChange = (event) => {
        this.setState({
            layers: event.target.value
        })
    }

    handleSelectedUser = (users) => {
        // console.log('user:::')
        // console.log(users);
        this.setState({currentUsers: users});
    }

    handleSelectedTeam = (teams) => {
        this.setState({currentTeams: teams})
    }

    render() {
        const index = this.props.index
        return (
            <tr>
                <td>{this.props.index}</td>
                <td><input class="form-control" type="number" value={this.state.layers[index].Delay} disabled={this.props.disabled} onChange={this.handleDelayChange} /></td>
                <td><Select disabled={this.props.disabled} multi value={this.state.currentUsers} options={this.state.userOptions} onChange={this.handleSelectedUser} /></td>
                <td><Select disabled={this.props.disabled} multi value={this.state.currentTeams} options={this.state.teamOptions} onChange={this.handleSelectedTeam} /></td>
                {this.props.disabled ? <td></td> : <td>
                    <p className="changeArrow" value={index} onClick={() => this.props.deleteLayer(index)} >&#10060;</p>
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








