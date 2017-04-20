import React from 'react';
import axios from 'axios'
import {Link} from 'react-router'
import MyPingTable from './MyPingTable.js'
import auth from '../auth.js'

export default class PingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usname: null
        }
    }

    componentWillMount() {
        auth.getCurrentUser().then(res => {
            this.setState({usname: res.Username});
        });
    }
    // displays two PingTables
    // 1) the user's pings
    // 2) all pings
    render() {
        return (
            <div className="container">
              <MyPingTable title="My Pings" Username={this.state.usname} />
              <MyPingTable title="All Pings" />
            </div>
        )
    }
}
