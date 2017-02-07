import React from 'react';
import axios from 'axios'


export default class PingsTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			pings: null,
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
			axios.get("/api/pings/getPingsForService?Name="+nextProps.service)
				.then((result) => {
					console.log("got pings for service")
					const pings = result.data
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
			<div className="col-xs-4">
				<table class="table">
				  <thead className="thead-inverse">
				    <tr><th>Pings</th></tr>
				  </thead>
				  <tbody>
				  	{mappedPingRows}
				  </tbody>
				</table>
			</div>
		)
	}
}