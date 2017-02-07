import React, {Component} from 'react';
import { Link } from 'react-router'
import axios from 'axios'

export default class TeamsList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			teams: null
		}
	}

	componentWillMount() {
		axios.get("http://localhost:8080/api/teams/getTeams")
			.then((result) => {
				console.log('got teams')
				console.log(result.data)
				const mappedTeams = result.data.map(team => team.Name)
				this.setState({teams: mappedTeams});
			})
			.catch((err) => {
				console.log(err);
			})
	}

	render() {
		const mappedTeamLinks = this.state.teams ? this.state.teams.map((team) => <li className="list-group item"><Link to={`/myteams/${team}`}>{team}</Link></li>) : <li>loading</li>
		return (
			<div className="container">
				<h1>My Teams</h1>
				<ul className="list-group">
					{mappedTeamLinks}
				</ul>
			</div>
		)
	}
}