import React from 'react'
import axios from 'axios'


export default class ServicesTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			services: null
		}
	}

	componentDidMount() {
		axios.get("/api/services/getNames")
			.then((result) => {
				console.log(result.data)
				this.setState({services: result.data});
				console.log(result.data[0])
				this.props.onServiceClick(result.data[0])
			})
			.catch((error) => {
				console.log(error);
			})
	}

	render() {
		const mappedServiceRows = this.state.services ? this.state.services.map(service =>
			<tr className={this.props.currentService == service ? "active-row" : ""} onClick={() => this.props.onServiceClick(service)}><td>{service}</td></tr>
		) : <tr><td>loading</td></tr>

		return (
			<div class="card home-card">
				<div class="home-card-header card-header">
					<h3>Services</h3>
				</div>
				<div class="card-block">
					<table class="table table-hover">
					  <tbody>
					  	{mappedServiceRows}
					  </tbody>
					</table>
				</div>
			</div>
		)
	}
}
