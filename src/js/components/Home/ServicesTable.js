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
		axios.get("http://localhost:8080/api/services")
			.then((result) => {
				console.log("hdhdhservice")
				this.setState({services: result.data});
			})
			.catch((error) => {
				console.log(err);
			})
	}

	render() {
		const mappedServiceRows = this.state.services ? this.state.services.map(service => 
			<tr><td>{service}</td></tr>
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