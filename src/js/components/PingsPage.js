import React from 'react';
import axios from 'axios'
import {Link} from 'react-router'
import PingTable from './PingTable.js'
import auth from '../auth.js'

export default class PingsPage extends React.Component {
    // displays two PingTables
    // 1) the user's unresolved pings
    // 2) all unresolved pings
    render() { 
        return (
            <div className="container"> 
                <PingTable Username={"zhancock"} />
                <PingTable/>
            </div>
        )
    }
}


// something with getCurrentUser from auth.js ---> not sure how to do this lol

// <PingTable Username={"zhancock"} /> ---> hardcoded
// <PingTable Username={this.state.Username} /> ---> NULL, page won't even load
// <PingTable Username={this.props.Username} />  ---> undefined
// <PingTable Username={this.props.params.Username} /> ---> undefined