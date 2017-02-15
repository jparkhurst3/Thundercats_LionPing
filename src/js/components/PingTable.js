import React from 'react';
var moment = require('moment');
import axios from 'axios'
import {Link} from 'react-router'

export default class PingTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pings: null,
			activePage: 0
		}
	}

	handlePageClick = (page) => {
		console.log(page)
		const numToShow = 3;
		//load differrent chunk or stuff

		const mappedPingRows = this.state.pings
			.filter((ping, index) => {
				return index >= numToShow*page && index < numToShow*(page+1)
			})
			.map((ping) => <PingRow ping={ping} />)

		this.setState({
			mappedPingRows: mappedPingRows,
			activePage: page
		})
	}

	componentDidMount() {
		//database call for all pings for this service
		const apiCall = `/api/pings/getPingsForService?Name=${this.props.service}`
		console.log(apiCall);
		axios.get(apiCall)
			.then((result) => {
				console.log(result.data)
				this.setState({ pings: result.data })
				const mappedPingRows = this.state.pings
					.filter((pings, index) => {
						//on page 0 return 3 elements
						return index < 3;
					})
					.map((ping) => <PingRow ping={ping} />)				
						this.setState({
							mappedPingRows: mappedPingRows
						})
			})
			.catch((error) => {
				console.log(error)
			})
		

	}

	render() {
		return (
			<div>
				<h3>Pings</h3>
				<table class="table table-hover">
					<thead className="thead-inverse">
						<tr>
							<th>Created At</th>
							<th>Name</th>
							<th>Description</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{this.state.mappedPingRows}
					</tbody>
				</table>
				<PingPagination activePage={this.state.activePage} handlePageClick={this.handlePageClick} />
			</div>
		)
	}
}

class PingPagination extends React.Component {
	render() {
		//get number from og query
		const items = [0,1,2,3,4,5,6]
		const mappedItems = items.map(item => {
			return <li style={{zIndex: 0}} class={this.props.activePage == item ? "page-item active" : "page-item"} onClick={() => this.props.handlePageClick(item)}><span class="page-link">{item}</span></li>
		})
		return (
			<nav>
			  <ul class="pagination">
			  	{mappedItems}
			  </ul>
			</nav>
		)
	}
}

class PingRow extends React.Component {
	render() {
		const time = moment(this.props.ping.CreatedTime).format('MMMM Do YYYY, h:mm:ss a')
		return (
			<tr>
				<td>{time}</td>
				<td>{this.props.ping.Name}</td>
				<td>{this.props.ping.Description}</td>
				<td>{this.props.ping.Status}</td>
			</tr>
		)
	}
}