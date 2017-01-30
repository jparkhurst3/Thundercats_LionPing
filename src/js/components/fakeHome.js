import React from 'react'
import axios from 'axios'

import NotificationCard from './Home/NotificationCard'
import NewPingCard from './Home/NewPingCard'
import MyScheduleCard from './Home/MyScheduleCard'

import ServicesTable from './Home/ServicesTable'
import ScheduleTable from './Home/ScheduleTable'
import PingsTable from './Home/PingsTable'

class HomeCards extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div class="card-deck ">
				  <NotificationCard />
				  <NewPingCard />
				  <MyScheduleCard />
				</div>
			</div>
		)
	}
}

class HomeTables extends React.Component {
	constructor(props) {
	    super(props);
	}

	render() {
		return (
			<div className="container">
				<div className="row">
					<ServicesTable />
					<ScheduleTable />
					<PingsTable />
				</div>
			</div>
		)
	}
}

export default class FakeHome extends React.Component {
	render() {
		return (
			<div>
				<HomeCards />
				<HomeTables />
			</div>
		)
	}
}



