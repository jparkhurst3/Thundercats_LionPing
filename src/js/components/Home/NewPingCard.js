import React from 'react'
import axios from 'axios'

export default class NewPingCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			services: null,
			description: "",
			name: "",
			service: ""
		}
	}

	componentDidMount() {
		axios.get("/api/services/getServices")
			.then((result) => {
				this.setState({services: result.data});
			})
			.catch((error) => {
				console.log(err);
			})
	}



	sendPing = () => {
		console.log("send ping");
		// req.query.serviceID + ',' + req.query.name + ',' + req.query.description
		const ping = {
			ServiceID: this.state.service,
			Name: this.state.name,
			Description: this.state.description
		}

		axios.post('/api/pings/createPing', ping)
			.then(res => {
				console.log('posted')
			})
			.catch(err => {
				console.log(err)
			})

		axios.post('/api/slack/', {description: this.state.description})
			.then((response) => {
				console.log("posted to slack")
			})
			.then((error) => {
				console.log(error)
			})
		this.setState({
			name: "",
			description: "",
			service: ""
		})
	}

	handleChange = (event) => {
		event.preventDefault()
		console.log(event.target.name)
		console.log(event.target.value)
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	render() {
		const mappedOptions = this.state.services ? this.state.services.map(service => <option value={service.ID}>{service.Name}</option>) : <option disabled>Loading</option>
		return (
		<div class="card">
		  	<div class="card-header">
			  New Ping
			</div>
		    <div class="card-block">
		      <form>
		      	<div class="form-group">
		      		<input type="text" name="name" class="form-control" placeholder="Name" value={this.state.name} onChange={this.handleChange}/>
				</div>
				<div class="form-group">
		      		<input type="text" name="description" class="form-control" placeholder="Description" value={this.state.description} onChange={this.handleChange}/>
				</div>
				<div class="form-group">
				    <select class="form-control" value={this.state.service} onChange={this.handleChange} name="service" id="exampleSelect1">
				    	<option value="" selected disabled>Select Service</option>
				      	{mappedOptions}
				    </select>
				</div>
				<input value="Create Ping" class="btn" onClick={this.sendPing}></input>
		      </form>
		    </div>
		  </div>
		  )
	}
}