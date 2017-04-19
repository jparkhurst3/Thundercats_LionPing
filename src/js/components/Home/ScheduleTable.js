import React from 'react';
import axios from 'axios'
import Logo, {LogoLoading} from '../Logo'



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
		const mappedRows = this.state.schedule ?
			this.state.schedule.map(s => <ScheduleRow date={s.date} name={s.name} time={s.time} />)
			: <tr><td style={{textAlign:"center"}}><LogoLoading /></td></tr>
		return(
			<div class="card home-card">
				<div class="home-card-header card-header">
					<h3>Schedule</h3>
				</div>
				<div class="card-block home-card-block">
					<table className="table home-table">
						<tbody>
							{mappedRows}
						</tbody>
					</table>
				</div>
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
