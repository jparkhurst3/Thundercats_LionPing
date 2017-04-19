import React from 'react';
import axios from 'axios'
import {Link} from 'react-router'
import PingTable from './PingTable.js'

export default class PingsPage extends React.Component {
    render() {
        return (
            <div className="container">
                <PingTable service={"UI"} />
                <PingTable service={"Database"} />
            </div>
        )
    }
}
