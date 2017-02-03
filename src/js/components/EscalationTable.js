import React from 'react'
import { Link } from 'react-router'
import axios from 'axios'


export default class EscalationTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            layers: null
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

    render() {
        const mappedLayers = this.state.layers ? this.state.layers.map((layer, index) => {
            console.log('index:' + index)
            const level = layer.Level;
            const delay = layer.Delay;
            const users = layer.Users;
            const schedules = layer.Schedules;
            return (
                <EscalationLayer level={index} delay={delay} users={users} schedules={schedules} />
            )
            }
        ) : <tr><td>loading</td></tr>


        return (
            <div>
                <div className="row">
                    <div className="col-xs-3">
                        <h3>Escalation Policy</h3>
                    </div>
                    <div className="col-xs-9">
                        <button type="submit" class="btn">Edit</button>
                    </div>
                </div>
                <table class="table table-hover">
                    <thead className="thead-inverse">
                        <tr>
                            <th>Level</th>
                            <th>Delay</th>
                            <th>Users</th>
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
    render() {
        const mappedUsers = this.props.users.map(user => 
            <li><Link to={`/users/${user.Username}`}>{user.Username}</Link></li>
        )
        return (
            <tr>
                <td>{this.props.level}</td>
                <td>{this.props.delay} minutes</td>
                <td><ul className="list-inline">{mappedUsers}</ul></td>
            </tr>
        )
    }
}