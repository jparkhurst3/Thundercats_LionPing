import React from 'react'
import axios from 'axios'

export default class NewPingCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			services: null,
			description: ""
		}
	}

	componentDidMount() {
		axios.get("http://localhost:8080/api/services/getNames")
			.then((result) => {
				this.setState({services: result.data});
			})
			.catch((error) => {
				console.log(err);
			})
	}



	sendPing = () => {
		console.log("send ping");

		axios.post('/api/slack/', {description: this.state.description})
			.then((response) => {
				console.log("posted to slack")
			})
			.then((error) => {
				console.log(error)
			})
	}

	handleChange = (event) => {
		event.preventDefault()
		this.setState({
			description: event.target.value
		});
	}

	render() {
		const mappedOptions = this.state.services ? this.state.services.map(service => <option>{service}</option>) : <option disabled>Loading</option>
		return (
		<div class="card">
		  	<div class="card-header">
			  New Ping
			</div>
		    <div class="card-block">
		      <form>
		      	<div class="form-group">
				    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Describe Issue" value={this.state.description} onChange={this.handleChange}/>
				  </div>
				  <div class="form-group">
				    <select class="form-control" id="exampleSelect1">
				      <option value="" selected disabled>Select Service</option>
				      {mappedOptions}
				    </select>
				  </div>
				  <button type="submit" class="btn" onClick={this.sendPing}>Create Ping</button>
		      </form>
		    </div>
		  </div>
		  )
	}
}