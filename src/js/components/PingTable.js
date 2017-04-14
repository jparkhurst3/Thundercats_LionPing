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
		const numToShow = 5;
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

	componentWillReceiveProps(nextProps) {
		if (nextProps !== this.props) {
			this.props = nextProps
			this.getPings()
		}
	}

	componentDidMount() {
		this.getPings()
	}

	getPings = () => {
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
						return index < 5;
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
			<div class="card home-card">
				<div class="card-header home-card-header">
					<h3>Pings</h3>
				</div>
				<div class="card-block services-card-block">
					<table class="table table-hover">
						<thead className="thead">
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
				</div>
			</div>
		)
	}
}
// <PingPagination numPings={this.state.pings.length} activePage={this.state.activePage} handlePageClick={this.handlePageClick} />

// <PingPagination activePage={this.state.activePage} handlePageClick={this.handlePageClick} />


class PingPagination extends React.Component {
	render() {
		//get number from og query
		// return (
		// 	<div class="text-center">
		// 	  <ul class="pagination" style={{display:"inline-block"}}>
		// 			<li style={{zIndex: 0}} class={this.props.activePage == item ? "page-item active" : "page-item"} onClick={() => this.props.handlePageClick(item)}><span class="page-link">Prev</span></li>
		// 			<li style={{zIndex: 0}} class={this.props.activePage == item ? "page-item active" : "page-item"} onClick={() => this.props.handlePageClick(item)}><span class="page-link">Next</span></li>
		// 	  </ul>
		// 	</div>
		//
		// )


		const items = [0,1,2,3,4,5,6]
		const mappedItems = items.map(item => {
			return <li style={{zIndex: 0}} class={this.props.activePage == item ? "page-item active" : "page-item"} onClick={() => this.props.handlePageClick(item)}><span class="page-link">{item}</span></li>
		})
		return (
			<div class="text-center">
			  <ul class="pagination" style={{display:"inline-block"}}>
			  	{mappedItems}
			  </ul>
			</div>
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
