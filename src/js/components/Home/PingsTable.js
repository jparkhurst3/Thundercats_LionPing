import React from 'react';
import axios from 'axios'
import {Link} from 'react-router'
import {browserHistory} from 'react-router';
import moment from 'moment'
import Logo, {LogoLoading} from '../Logo'


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
			axios.get("/api/pings/getPingsForService?Name="+nextProps.service+"&limit="+5)
				.then((res) => {
					console.log("got pings for service")
					this.onServiceChange(res.data)
				}).catch((err) => {
					console.log(err)
				})
		}
	}

	onClick = (id) => {
		console.log("onclick: " + id)
		browserHistory.push(`/pings/${id}`);
	}

	render() {
		const mappedPingRows = this.state.pings ? this.state.pings.map(ping =>
			<tr onClick={() => this.onClick(ping.ID)}>
				<td style={ping.Status == "Open" ? {fontWeight:"bold"} : {fontWeight:"normal"}}>{ping.Name}</td>
				<td>{moment(ping.CreatedTime).fromNow()}</td>
			</tr>
		)  : <tr><td style={{textAlign:"center"}}><LogoLoading /></td></tr>

		// const mappedPingRows = <tr><td style={{textAlign:"center"}}><LogoLoading /></td></tr>
		return (
			<div class="card home-card" style={{flex:"2", marginLeft:"25px"}}>
				<div class="home-card-header card-header">
					<h3>{this.props.service} Pings</h3>
				</div>
				<div class="card-block home-card-block">
					<table class="table home-table table-hover">
						<tbody>
							{mappedPingRows}
						</tbody>
					</table>
					<div class="home-table-button-wrapper">
						<Link class="btn home-table-button" to={`/services/${this.props.service}`} >Go to {this.props.service} Service</Link>
					</div>
				</div>
			</div>
		)
	}
}
