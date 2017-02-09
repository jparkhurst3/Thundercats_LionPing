import React from 'react';
var moment = require('moment');
import axios from 'axios'
import {Link} from 'react-router'
import EscalationTable from './EscalationTable.js'
import PingTable from './PingTable.js'
import Select from 'react-select'
import { browserHistory } from 'react-router';
import { withRouter } from 'react-router'

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
				<SelectService service={this.props.params.service} />
				<PingTable service={this.props.params.service} />
                <EscalationTable service={this.props.params.service} />
			</div>
		)
	}
}

class SelectService extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			services: null,
			value: props.service
		}
	}

	componentWillMount() {
		axios.get("http://localhost:8080/api/services/getNames")
			.then((result) => {
				console.log('got services')
				console.log(result.data)
				this.setState({services: result.data});
			})
			.catch((err) => {
				console.log(err);
			})
	}

	handleSelected = (value) => {
		console.log("selected")
		browserHistory.push(`myservices/${value.label}`);
		window.location.reload()
		this.setState({
			value
		})
	}

	renderLink = (service) => <Link to="myservices/${value.label}`" ></Link>

	render() {
		const mappedServices = this.state.services ? this.state.services.map((service) => {
			return {value: service, label: service}
		}) : [{value: this.props.service, label: this.props.service}]

		return (
			<div class="row">
				<h1 class="col-xs-6">{this.props.service} Service</h1>
				<h1 class="col-xs-3">Select Service</h1>
				<Select class="col-xs-3" value={this.state.value} options={mappedServices} onChange={this.handleSelected} />
			</div>
		)
	}


}