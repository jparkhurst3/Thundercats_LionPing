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
			<div className="col-xs-4">
				<table class="table table-hover">
				  <thead className="thead-inverse">
				    <tr><th>Services</th></tr>
				  </thead>
				  <tbody>
				  	{mappedServiceRows}
				  </tbody>
				</table>
			</div>
		)
	}
}