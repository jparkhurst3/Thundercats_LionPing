import React from 'react';
import axios from 'axios'
import {Link} from 'react-router'


export default class PingsTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			pings: null,
			service: this.props.service
		}
	}

	componentDidMount() {
		// fetchSchedule("Database")
		console.log("compoent will mount")

	}

	onServiceChange = (pings) => {
		console.log("pings: ")
		console.log(pings)
		this.setState({
			pings: pings
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.service !== this.props.service) {
			console.log("new service!")
			this.setState({
				service: nextProps.service
			})
			axios.get("/api/pings/getPingsForService?Name="+nextProps.service)
				.then((result) => {
					console.log("got pings for service")
					const pings = result.data.slice(0, 5); //only show 5 - do this in database
					this.onServiceChange(pings)
				}).catch((err) => {
					console.log(err)
				})
		}
	}

	render() {
		const mappedPingRows = this.state.pings ? this.state.pings.map(ping =>
			<tr><td>{ping.Name}</td></tr>
		)  : <tr><td></td></tr>

		return (
			<div class="card home-card">
				<div class="home-card-header card-header">
					<h3>Pings</h3>
				</div>
				<div class="card-block">
					<table class="table home-table">
						<tbody>
							{mappedPingRows}
						</tbody>
					</table>
					<Link class="btn home-button" to={`/myservices/${this.props.service}`} >Go to {this.props.service} Service Page</Link>
				</div>
			</div>
		)
	}
}
