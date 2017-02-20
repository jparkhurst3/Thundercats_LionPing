import React from 'react';
var moment = require('moment');
import axios from 'axios'
import {Link} from 'react-router'
import EscalationTable from './EscalationTable.js'
import PingTable from './PingTable.js'
import Select from 'react-select-plus'
import { browserHistory } from 'react-router';
import { withRouter } from 'react-router'
import CreateServiceModal from './CreateServiceModal'

export default class ServicePage extends React.Component {
	render() {
		if (!this.props.params.service) {
			return (
				<div class="container">
					<SelectService />
				</div>
			)
		}
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
		console.log(value)
		browserHistory.push(`myservices/${value.label}`);
		window.location.reload()

		this.setState({
			value
		})
	}

	valueRenderer = (option) => {
		return <h3 style={{ paddingTop: '8px'}}><strong>{option.label}</strong></h3>
	}

	renderLink = (service) => <Link to="myservices/${value.label}`" ></Link>

	render() {
		// const mappedMyServices = this.state.services ? this.state.services.map((service) => {
		// 	return {value: service, label: service} : [{value: this.props.service, label: this.props.service}]

		const mappedAllServices = this.state.services ? [{
			label: 'My Services', 
			options: this.state.services.map(service => { return {value: service, label: service} })
		}] : [{value: this.props.service, label: this.props.service}]

		return (
			<div class="row" style={{verticalAlign: 'text-bottom'}}>
				<Select class="col-xs-4" style={{paddingLeft: '0px', height: '50px'}} valueRenderer={this.valueRenderer} clearable={false} value={this.state.value} placeholder={<h3 style={{ paddingTop: '8px' }}><strong>Select Service</strong></h3>} options={mappedAllServices} onChange={this.handleSelected} />
				<input type="button" class="btn btn-secondary col-xs-4" data-container="body" value="Service Description" data-toggle="popover" data-placement="bottom" data-content="popover text"></input>
				<div class="col-xs-2"></div>
				<CreateServiceModal style={{float: "right"}} class="col-xs-2" />
			</div>
		)
	}
				// <h1 class="col-xs-6" style={{verticalAlign: 'text-bottom'}}>{this.props.service} Service</h1>


}