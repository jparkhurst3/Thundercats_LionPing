import React from 'react';
import axios from 'axios'


export default class ScheduleTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			schedule: null
		}
	}

	componentDidMount() {
		axios.get("http://localhost:8080/api/schedule")
			.then((result) => {
				this.setState({schedule: result.data})
			}).catch((err) => {
				console.log(err)
			})
	}

	render() {
		if (!this.state.schedule) {
			return <p>loading</p>
		}
		const mappedRows = this.state.schedule.map(s => <ScheduleRow date={s.date} name={s.name} time={s.time} />)
		return (
			<div className="col-xs-4">
				<table className="table">
				  <thead className="thead-inverse">
				    <tr><th></th><th>Schedule</th></tr>
				  </thead>
				  <tbody>
				  	{mappedRows}
				  </tbody>
				</table>
			</div>
		)
	}
}

class ScheduleRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
				<td>{this.props.date}</td>
				<td>
					<h4>{this.props.name}</h4>
					<p>{this.props.time}</p>
				</td>
			</tr>
		)
	}
}