import React from 'react';
var moment = require('moment');
import axios from 'axios'
import {Link, browserHistory} from 'react-router'
import Logo, {LogoLoading} from './Logo.js'

export default class MyPingTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pings: null,
			activePage: 0,
			mappedPingRows: <tr style={{textAlign:"center"}}><td colSpan="4"><LogoLoading /></td></tr>
		}
	}

	handlePrevClick = () => {
		this.setState({
			activePage: this.state.activePage-1
		})
		// console.log("prevclick")
		// console.log("activepage: " + this.state.activePage )
		const numToShow = 5;
		const ac = this.state.activePage-1
		// console.log("ac: " + ac )

		const mappedPingRows = this.state.pings
			.filter((ping, index) => numToShow * ac <= index && index < numToShow * (ac+1)) // [0,5),[5,10),
			// .filter((ping, index) => index >= numToShow * this.state.activePage && index < numToShow * (this.state.activePage + 1))
			.map(ping => <PingRow ping={ping} />)

		this.setState({
			mappedPingRows: mappedPingRows,
			activePage: this.state.activePage-1
		})
	}

	handleNextClick = () => {
		// console.log("nextclick")
		// console.log("activepage: " + this.state.activePage )
		const numToShow = 5;
		const ac = this.state.activePage+1
		// console.log("ac: " + ac )

		const mappedPingRows = this.state.pings
		.filter((ping, index) => numToShow * ac <= index && index < numToShow * (ac+1)) // [0,5),[5,10),
			// .filter((ping, index) => index >= numToShow * this.state.activePage && index < numToShow * (this.state.activePage + 1))
			.map(ping => <PingRow ping={ping} />)

		this.setState({
			mappedPingRows: mappedPingRows,
			activePage: this.state.activePage+1
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
		var apiCall = "";
		// how to populate table based on if it's called from ServicePage or PingsPage
		if (this.props.Username != undefined) {
			apiCall = `/api/pings/getMyUnresolvedPings?Username=${this.props.Username}` // unresolved pings for given user
		} else {
			apiCall = `/api/pings/getUnresolvedPings` // all unresolved pings
		}
		// console.log(apiCall);
		axios.get(apiCall)
			.then((result) => {
				// console.log(result.data)
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
		if (this.props.Username != undefined) {
			return (
				<div class="card home-card">
					<div class="card-header home-card-header">
						<h3>My Pings</h3>
					</div>
					<div class="card-block services-card-block">
						<table class="table table-hover">
							<thead className="thead">
								<tr>
									<th>Created At</th>
									<th>Service</th>
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
					{this.state.pings ?
						<PingPagination prevDisabled={this.state.activePage == 0} nextDisabled={this.state.pings.length / 5 <= this.state.activePage+1} numPings={this.state.pings.length} handleNextClick={this.handleNextClick} handlePrevClick={this.handlePrevClick} />
						: null }
				</div>
			)
		} else {
			return (
				<div class="card home-card">
					<div class="card-header home-card-header">
						<h3>All Pings</h3>
					</div>
					<div class="card-block services-card-block">
						<table class="table table-hover">
							<thead className="thead">
								<tr>
									<th>Created At</th>
									<th>Service</th>
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
					{this.state.pings ?
						<PingPagination prevDisabled={this.state.activePage == 0} nextDisabled={this.state.pings.length / 5 <= this.state.activePage+1} numPings={this.state.pings.length} handleNextClick={this.handleNextClick} handlePrevClick={this.handlePrevClick} />
						: null }
				</div>
			)
		}
	}
}

// <PingPagination activePage={this.state.activePage} handlePageClick={this.handlePageClick} />


class PingPagination extends React.Component {
	render() {
		// get number from og query
		return (
			<div class="text-center">
			  <ul class="pagination" style={{display:"inline-block"}}>
					<li style={{zIndex: 0}} class={this.props.prevDisabled ? "page-item disabled":"page-item"} onClick={() => this.props.handlePrevClick()}><span class="page-link">Prev</span></li>
					<li style={{zIndex: 0}} class={this.props.nextDisabled ? "page-item disabled":"page-item"} onClick={() => this.props.handleNextClick()}><span class="page-link">Next</span></li>
			  </ul>
			</div>
		)


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
 //    constructor(props) {
 //        super(props);
 //        this.state = {
 //            services: null
 //        }
 //    }

	// componentDidMount() {
	// 	axios.get("http://localhost:8080/api/services/getNames")
	// 		.then((result) => {
	// 			// console.log('got services')
	// 			console.log(result.data)
	// 			this.setState({services: result.data});
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		})
	// }

	onClick = (id) => {
		// console.log("onclick: " + id)
		browserHistory.push(`/pings/${id}`);
	}

	render() {
		const time = moment(this.props.ping.CreatedTime).calendar()
		// console.log(this.state.services);
		// const serviceList = this.state.services;
		// const serviceList = ["Database", "UI", "Server", "Sam Service", "Backend"];
		// console.log(serviceList);
		// if (serviceList != null) {
		// 	return (
		// 		<tr onClick={() => this.onClick(this.props.ping.ID)}>
		// 			<td>{time}</td>
		// 			<td>{serviceList[this.props.ping.ServiceID]}</td>
		// 			<td>{this.props.ping.Name}</td>
		// 			<td>{this.props.ping.Description}</td>
		// 			<td>{this.props.ping.Status}</td>
		// 		</tr>
		// 	)
		// } else {
			return (
				<tr onClick={() => this.onClick(this.props.ping.ID)}>
					<td>{time}</td>
					<td>{this.props.ping.ServiceID}</td>
					<td>{this.props.ping.Name}</td>
					<td>{this.props.ping.Description}</td>
					<td>{this.props.ping.Status}</td>
				</tr>
			)
		// }
	}
}

//this.state.services[this.props.ping.ServiceID - 1]