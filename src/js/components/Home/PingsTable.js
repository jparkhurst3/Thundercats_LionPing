import React from 'react';
import axios from 'axios'


export default class PingsTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			pings: null
		}
	}

	componentDidMount() {
		// fetchSchedule("Database")
		console.log("compoent will mount")
		const _this = this;
		axios.get("http://localhost:8080/api/pings")
			.then(function(result) {
				console.log("got services result")
				_this.setState({pings: result.data})
			}).catch(function(err) {
				console.log(err)
			})
	}

	render() {
		if (!this.state.pings) {
			return <h1>loading</h1>
		}
		const mappedPingRows = this.state.pings.map(ping => 
			<tr><td>{ping}</td></tr>
		)
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