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
		axios.get("/api/services/getMyServices")
			.then((result) => {
				console.log("getMyServices")
				console.log(result.data)
				this.setState({services: result.data.map(r => r.Name)});
				console.log(result.data[0])
				this.props.onServiceClick(result.data[0].Name)
			})
			.catch((error) => {
				console.log(error);
			})
	}

	render() {
		const mappedServiceRows = this.state.services ? this.state.services.map(service =>
			<tr className={this.props.currentService == service ? "active-row" : ""} onClick={() => this.props.onServiceClick(service)}><td>{service}</td></tr>
		) : <tr><td></td></tr>

		return (
			<div class="card home-card" style={{flex:"1"}}>
				<div class="home-card-header card-header">
					<h3>My Services</h3>
				</div>
				<div class="card-block home-card-block">
					<table class="table home-table table-hover">
					  <tbody>
					  	{mappedServiceRows}
					  </tbody>
					</table>
				</div>
			</div>
		)
	}
}
