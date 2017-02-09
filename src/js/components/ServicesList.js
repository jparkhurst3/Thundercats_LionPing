import React, {Component} from 'react';
import { Link } from 'react-router'
import axios from 'axios'

export default class ServicesList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			services: null
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

	render() {
		const mappedServiceLinks = this.state.services ? 
			this.state.services.map((service) => <li className="list-group item"><Link to={`/myservices/${service}`}>{service}</Link></li>) 
			: <li>loading</li>
		return (
			<div className="container">
				<h1>My Services</h1>
				<ul className="list-group">
					{mappedServiceLinks}
				</ul>
			</div>
		)
	}
}