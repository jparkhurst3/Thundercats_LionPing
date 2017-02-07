import React from 'react';
var moment = require('moment');
import axios from 'axios'
import {Link} from 'react-router'
import EscalationTable from './EscalationTable.js'
import PingTable from './PingTable.js'

export default class ServicePage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			serviceID: null
		}
	}

	render() {
		return (
			<div className="container">
				<h1>{this.props.params.service} Service</h1>
				<PingTable service={this.props.params.service} />
                <EscalationTable service={this.props.params.service} />
			</div>
		)
	}
}